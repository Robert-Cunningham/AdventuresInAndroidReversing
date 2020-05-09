import frida
import time

device = frida.get_usb_device()

def on_message(m):
    print(m['payload'])

print(device)

pid = device.spawn(["com.com2us.imo.normal.freefull.google.global.android.common"])
print("PID is", pid)

session = device.attach(pid)
script = session.create_script(open('dump_classes.js').read())
script.on('message', on_message)

device.resume(pid)
time.sleep(2)

script.load()

print('Done.')
input()