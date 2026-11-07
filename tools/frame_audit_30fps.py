# Kiểm tra intro ở 30 khung/giây: dựng từng khung theo thời gian giả (1/30 s), đo ms/khung và độ đổi hình giữa hai khung liên tiếp.
# Cần: pip install playwright && playwright install chromium. Đường dẫn file://... bên dưới sửa theo máy của bạn.
import sys, json, time, base64
from playwright.sync_api import sync_playwright
W,H=960,540
INIT="""
window.__q=[];window.requestAnimationFrame=cb=>{__q.push(cb);return 1};
window.__rn=performance.now.bind(performance);window.__vn=0;performance.now=()=>window.__vn;
"""
STEP=1000/30
with sync_playwright() as p:
    b=p.chromium.launch(args=['--allow-file-access-from-files'])
    pg=b.new_page(viewport={'width':W,'height':H})
    errs=[]
    pg.on('console',lambda m: errs.append(m.type+': '+m.text) if m.type in('error',) and 'ERR_FAILED' not in m.text else None)
    pg.on('pageerror',lambda e: errs.append('PAGEERR '+str(e)))
    pg.route('**/*',lambda r: r.abort() if r.request.url.startswith('http') else r.continue_())
    pg.add_init_script(INIT)
    pg.goto('file:///home/claude/psk/PHU-SA-KY-main/index.html'); pg.wait_for_timeout(1200)
    pg.evaluate("window.__th=document.createElement('canvas');__th.width=192;__th.height=108;window.__tg=__th.getContext('2d',{willReadFrequently:true});window.__prev=null")
    pg.click('#go')
    for _ in range(100):
        if pg.evaluate("__q.length>0 && CIN.state.run"): break
        pg.wait_for_timeout(100)
    STEPJS="""(vn)=>{__vn=vn;const cbs=__q.splice(0);const t=__rn();cbs.forEach(cb=>cb(vn));const ms=__rn()-t;
      __tg.drawImage(document.getElementById('cin'),0,0,192,108);const d=__tg.getImageData(0,0,192,108).data;let df=0,lum=0;
      if(__prev){for(let i=0;i<d.length;i+=4){df+=Math.abs(d[i]-__prev[i])+Math.abs(d[i+1]-__prev[i+1])+Math.abs(d[i+2]-__prev[i+2])}}
      for(let i=0;i<d.length;i+=4)lum+=d[i]+d[i+1]+d[i+2];
      __prev=new Uint8ClampedArray(d);
      return {ms,df:df/(192*108*3),lum:lum/(192*108*3),n:CIN.state.n,tr:CIN.state.tr,T:CIN.state.T,jpg:__th.toDataURL('image/jpeg',.55)}}"""
    rec=[];vn=0;prodone=False;i=0
    t_start=time.time()
    while True:
        r=pg.evaluate(STEPJS,vn); rec.append(r)
        pro=pg.evaluate("document.body.classList.contains('pro')")
        ended=pg.evaluate("!CIN.state.run")
        if pro and not prodone:
            # chạy hết hộp thoại tiền truyện (nhánh 1) rồi tiếp tục dòng thời gian
            for k in range(600):
                if not pg.evaluate("document.body.classList.contains('pro')"): break
                n=pg.evaluate("document.querySelectorAll('#ch button').length")
                if n: pg.evaluate("document.querySelectorAll('#ch button')[0].click()")
                else: pg.evaluate("adv&&adv()")
                if k%6==0:
                    vn+=STEP; rec.append(pg.evaluate(STEPJS,vn))   # vẫn dựng hình trong lúc đọc thoại
                pg.wait_for_timeout(15)
            prodone=True
        if ended or r['T']>82: break
        vn+=STEP;i+=1
        if i%150==0: print('frame',i,'T=%.1f'%r['T'],'elapsed %.0fs'%(time.time()-t_start),flush=True)
        if time.time()-t_start>1500: print('timeout');break
    jp=[r.pop('jpg') for r in rec]
    json.dump(rec,open('/home/claude/h30_rec.json','w'))
    import os;os.makedirs('/home/claude/th',exist_ok=True)
    for k,j in enumerate(jp): open(f'/home/claude/th/{k:04d}.jpg','wb').write(base64.b64decode(j.split(',')[1]))
    print('done frames',len(rec),'errors',sorted(set(errs))[:5],flush=True)
    b.close()
