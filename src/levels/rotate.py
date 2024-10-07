thing1="""XXXXXXXXXXXXXXX
XCCC,,X,,,XXGGX
XCCC,,X,B,DT,,X
XCCCC,X,,,XX,XX
XC,,CCX,,,,XDXX
X,,,,H,,,B,XDXX
X,,,,CX,,,,XDXX
X,,,,XXXX,,,,,X
XTXX,,WW,,,,,,X
X,,,,,WW,,,,B,X
XXXX,,WW,,,,,,X
XXXB,,WW,,,,,WX
XXXXXXWW,,,W,WX
X,,,,XWWW,,WWWX
X,B,,DWWWW,WWWX
X,,X,XWWXW,,WXX
X,,T,XWWXXX,XXX
XXXXXXXXXXXXXXX"""

thing2=""",,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,
,,,,,,,,,,,,R,,
,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,
,,,R,,,,,,,,,,,
,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,
,T,,R,,,,,R,,,,
,M,,,,,,,,,,,,,
,,,,,,,,,,,,,,,"""

thing3=""",,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,
,,,,,,,,5,2,,,,
,,,,,,,,,,,,,,,
,,,,,,,,,,,,5,,
,,,,,2,,,4,,4,,
,,,,,,,,,,,,3,,
,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,
,,,,,,,,,,,,3,,
,,,,,,,,,,,,,,,
,,,2,,,,,,,,,,,
,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,
,,1,,1,,,,,,,,,
,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,"""

thing4="""qwerty
asdfgh
zxcvb"""

#thing4=thing4.split('\n')
print("len then len[0]")
print(len(thing4))
print(len(thing4[0]))

print("this is [0]")
print(thing4[0])
#im sorry but theres less than two hours left of ludum dare
def rotate_this_shit(shit):
    shit = shit.split("\n")[:-1]
    turd = [[0 for i in range(len(shit))] for n in range(len(shit[0]))]
    #debug zone
    print("len shit: " + str(len(shit)))
    print("len shit[0]"+ str(len(shit[0])))
    print("len turd: " + str(len(turd)))
    print("len turd[0]"+ str(len(turd[0])))
    #end debug zone
    for i in range(len(shit)):
        for n in range(len(shit[0])):
            turd[n][i] = shit[i][n]
    return turd

def rotate_real(shit):
    shit = shit.split("\n")[:-1]
    print(len(shit[0]))
    for i in range(len(shit[0])):
        why = []
        for n in range(len(shit)):
            why.append(shit[i][n])
        # print(i)
        # print(len(why))
        print(''.join(why))

def stack_why(shit):
    shit = shit.split("\n")
    return list(zip(*shit[::-1]))


print("this is the circuits")
thing1 = stack_why(thing3)[::-1]
for fuck in thing1:
    print(''.join(fuck))