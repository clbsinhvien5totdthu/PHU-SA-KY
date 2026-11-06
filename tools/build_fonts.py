"""Nhúng VT323 (phông pixel, đủ dấu tiếng Việt) vào css/fonts.css dạng base64 → chạy được cả khi mở file:// và trong bản đơn.  python tools/build_fonts.py"""
import base64,os
r=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
b=base64.b64encode(open(r+'/assets/fonts/VT323-Regular.ttf','rb').read()).decode()
open(r+'/css/fonts.css','w',encoding='utf8').write("@font-face{font-family:'VT323';font-style:normal;font-weight:400;font-display:swap;src:url(data:font/ttf;base64,"+b+") format('truetype')}\n")
print('css/fonts.css')
