// Thanks https://github.com/0xdea/frida-scripts/blob/master/android-snippets/
// & https://github.com/iddoeldor/frida-snippets

var printTrace = function () {
    var throwable = Java.use("java.lang.Throwable")
    console.log(throwable.$new().getStackTrace())
}

var getTrace = function () {
    var throwable = Java.use("java.lang.Throwable")
    return throwable.$new().getStackTrace()
}

setTimeout(function () {

    Java.perform(function () {
        console.log('running')

        var log = Java.use("android.util.Log");
        var exception = Java.use("java.lang.Exception");
        onsole.log(JSON.stringify(Process.findModuleByName('libart.so').enumerateSymbols())) // Look for OpenMemory Dex etc in this, from 7_1_2.
        Process.enumerateModules().forEach(function (a) {
            if (a.name === "libart.so") {

            }
            //console.log(JSON.stringify(a)) 
        })

        var open = new NativeFunction(Module.findExportByName('libc.so', 'open'), 'pointer', ['pointer', 'int']);

        Interceptor.replace(open, new NativeCallback(function (path, mode) {
            console.log('opening', Memory.readUtf8String(path))
            return open(path, mode)
        }, 'pointer', ['pointer', 'int']))

        var exit = new NativeFunction(Module.findExportByName(null, "_exit"), 'int', ['int'])

        Java.use("java.lang.System").exit.implementation = function (int) {
            console.log("Trying to exit, yeet.")
            return 0;
        }

        Interceptor.replace(exit, new NativeCallback(function (status) {
            console.log('Trying to exit!')
            return 0;
        }, 'int', ['int']))

        var fork = new NativeFunction(Module.findExportByName(null, 'fork'), 'int', [])

        Interceptor.replace(fork, new NativeCallback(function (path, mode) {
            console.log('forking...!')
            //fork()
            return 1000
            //return fork()
        }, 'int', []))

        function hookEquals() {
            Java.use('java.lang.String')['equals'].implementation = function (a) {
                if ((a + "").includes('MessageDigest') && !(a + "").includes('facebook')) {
                    console.log(a)
                    printTrace();
                }
                //if (a.includes && a.includes('MessageDigest')) {
                //}
                return this['equals'](a)
            }
        }

        Java.use('java.util.Arrays')['equals'].overload('[B', '[B').implementation = function (a) {
            console.log('inside byte array!')
            // console.log(Java.enumerateLoadedClassesSync())
            // return this['equals'](a)
            //console.log("byte array equals", this, a)
            //var out = this['equals'](a)
            console.log(getTrace() + "")
            if ((getTrace() + "").includes('inca')) {
                //console.log('hijacking originally was', out, 'now true')
                console.log('hijacking!!!\n\n\n')
                return true
            } else {
                return true
            }
        }

        Java.use('java.lang.StringBuilder')['toString'].implementation = function () {
            var ret = this['toString']();
            console.log("a", ret, getStackTrace())
            return ret
        }

        Java.use('java.lang.Thread')['run'].implementation = function (args) {
            console.log('thread running.')
            printTrace()
            console.log('a', args)
        }

        Java.use('com.inca.security.IIIIiiiiii')['run'].implementation = function () {
            console.log('args')
            console.log('security.')
            // var ret = this['run'](args)
            // console.log('ret', ret)
            // return ret
        }

        Java.enumerateLoadedClassesSync().forEach(function (a) {
            if (a.includes('inca') || a.includes('com2us')) {
                console.log(a)
            }
        })

        Java.enumerateLoadedClassesSync().forEach(function (a) {
            if (a.includes('your_package')) {
                console.log(a)
            }
        })
        console.log('print done')
    })
}

// my_class.fun.overload("java.lang.String").implementation = function (x) { //hooking the new function
//     var my_string = string_class.$new("My TeSt String#####"); //creating a new String by using `new` operator 
//     console.log("Original arg: " + x);
//     var ret = this.fun(my_string); // calling the original function with the new String, and putting its return value in ret variable
//     console.log("Return value: " + ret);
//     return ret;
// };
