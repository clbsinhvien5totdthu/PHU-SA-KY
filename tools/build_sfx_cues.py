"""Đóng gói assets/audio/sfx/cue/*.{wav,mp3,ogg} -> js/data/cuedata.js (base64). Tên file (không đuôi) = tên cue, vd oar.mp3 -> cue_oar.  python tools/build_sfx_cues.py"""
import base64,os,json
r=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));d=r+'/assets/audio/sfx/cue';out={}
MIME={'.wav':'audio/wav','.mp3':'audio/mpeg','.ogg':'audio/ogg'}
for f in sorted(os.listdir(d)):
    n,e=os.path.splitext(f)
    if e.lower() in MIME:out['cue_'+n]='data:'+MIME[e.lower()]+';base64,'+base64.b64encode(open(d+'/'+f,'rb').read()).decode()
open(r+'/js/data/cuedata.js','w',encoding='utf8').write('/* sinh bởi tools/build_sfx_cues.py */\nwindow.SFXC='+json.dumps(out)+';\n');print(len(out),'cue:',', '.join(out) or '(trống)')
