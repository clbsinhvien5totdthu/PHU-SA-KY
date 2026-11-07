"""Nhúng phông vào css/fonts.css dạng base64 → chạy được cả khi mở file:// và khi KHÔNG có mạng.  python tools/build_fonts.py
VT323-Regular.ttf là bắt buộc. Các tệp sau (tải từ Google Fonts, đủ dấu tiếng Việt) nếu có trong assets/fonts/ sẽ được nhúng luôn:
  BeVietnamPro-Regular/Medium/Bold.ttf · PlayfairDisplay-Regular/Italic/Bold.ttf · PatrickHand-Regular.ttf"""
import base64,os
r=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F=[('VT323','normal',400,'VT323-Regular.ttf'),('Be Vietnam Pro','normal',400,'BeVietnamPro-Regular.ttf'),('Be Vietnam Pro','normal',500,'BeVietnamPro-Medium.ttf'),('Be Vietnam Pro','normal',700,'BeVietnamPro-Bold.ttf'),
   ('Playfair Display','normal',400,'PlayfairDisplay-Regular.ttf'),('Playfair Display','italic',400,'PlayfairDisplay-Italic.ttf'),('Playfair Display','normal',700,'PlayfairDisplay-Bold.ttf'),('Patrick Hand','normal',400,'PatrickHand-Regular.ttf')]
css='';ok=[]
for fam,st,w,fn in F:
    p=r+'/assets/fonts/'+fn
    if not os.path.exists(p):
        if fn.startswith('VT323'): raise SystemExit('thiếu '+p)
        continue
    b=base64.b64encode(open(p,'rb').read()).decode();ok.append(fn)
    css+="@font-face{font-family:'%s';font-style:%s;font-weight:%d;font-display:swap;src:url(data:font/ttf;base64,%s) format('truetype')}\n"%(fam,st,w,b)
open(r+'/css/fonts.css','w',encoding='utf8').write(css);print('css/fonts.css nhúng:',', '.join(ok))
