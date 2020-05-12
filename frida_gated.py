import frida
import time
device = frida.get_usb_device()

from pprint import pprint

def on_message(m, _data):
    if m['type'] == 'send':
        print(m['payload'])
    else:
        if m['type'] == 'error':
            pprint(m)
            exit(2)

print(device)

device.enable_spawn_gating()


# print(spawn)

def onSpawn(spawn):
    print('spawned', spawn)

# device.events.listen('spawned', onSpawn)


pid = device.spawn(["com.com2us.imo.normal.freefull.google.global.android.common"])
print("PID is", pid)

session = device.attach(pid)
#script = session.create_script(open('strazzere.js').read())
script = session.create_script(open('dump_classes.js').read())
script.on('message', on_message)

#input()

device.resume(pid)
time.sleep(2)


#cript.load()

while True:
    for p in device.enumerate_pending_children():
        print('c', p)
    for p in device.enumerate_pending_spawn():
        print('s', p)
    time.sleep(.1)

print('done')
input()