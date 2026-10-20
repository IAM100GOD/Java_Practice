import javax.tools.*;
import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.net.URI;
import java.util.List;

public class JvmTour {

    // A loader that defines exactly one class, Plugin, from bytes it holds in memory.
    static final class MemoryLoader extends ClassLoader {
        private final byte[] bytes;
        MemoryLoader(byte[] bytes) { super(JvmTour.class.getClassLoader()); this.bytes = bytes; }
        @Override protected Class<?> findClass(String name) throws ClassNotFoundException {
            if (name.equals("Plugin")) return defineClass(name, bytes, 0, bytes.length);
            throw new ClassNotFoundException(name);
        }
    }

    // Compile "public class Plugin {}" to bytes without touching the file system.
    static byte[] compilePlugin() throws Exception {
        JavaCompiler javac = ToolProvider.getSystemJavaCompiler();
        var source = new SimpleJavaFileObject(URI.create("string:///Plugin.java"), JavaFileObject.Kind.SOURCE) {
            @Override public CharSequence getCharContent(boolean ignore) { return "public class Plugin { public String hello() { return \"hi\"; } }"; }
        };
        var out = new ByteArrayOutputStream();
        var fm = new ForwardingJavaFileManager<StandardJavaFileManager>(javac.getStandardFileManager(null, null, null)) {
            @Override public JavaFileObject getJavaFileForOutput(Location l, String cls, JavaFileObject.Kind k, FileObject sib) {
                return new SimpleJavaFileObject(URI.create("bytes:///" + cls), k) {
                    @Override public OutputStream openOutputStream() { return out; }
                };
            }
        };
        if (!javac.getTask(null, fm, null, null, null, List.of(source)).call()) throw new IllegalStateException("compile failed");
        return out.toByteArray();
    }

    static void loaderDemo() throws Exception {
        byte[] bytes = compilePlugin();
        Class<?> a = new MemoryLoader(bytes).loadClass("Plugin");
        Class<?> b = new MemoryLoader(bytes).loadClass("Plugin");
        System.out.println("same Class object? " + (a == b) + "   same name? " + a.getName().equals(b.getName()));
        Object fromA = a.getDeclaredConstructor().newInstance();
        try {
            b.cast(fromA);                       // the cast that plugin frameworks get wrong
            System.out.println("cast succeeded (unexpected)");
        } catch (ClassCastException e) {
            System.out.println("ClassCastException: " + e.getMessage());
        }
    }

    static long sink;                             // keeps the JIT from deleting the work below

    static long sum(int[] a) {                    // the method we watch move through the tiers
        long s = 0;
        for (int x : a) s += x;
        return s;
    }

    static void jitDemo() {
        int[] data = new int[64];
        for (int i = 0; i < data.length; i++) data[i] = i;
        for (int batch = 1; batch <= 8; batch++) {
            long t0 = System.nanoTime();
            for (int i = 0; i < 20_000; i++) sink += sum(data);
            long perCall = (System.nanoTime() - t0) / 20_000;
            System.out.println("batch " + batch + ": " + perCall + " ns per call");
        }
    }

    public static void main(String[] args) throws Exception {
        loaderDemo();
        jitDemo();
    }
}
