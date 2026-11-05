"""Gộp toàn bộ dự án thành 1 file HTML để chia sẻ:  python tools/build_single.py -> dist/phu_sa_ky.html"""
import re,os
r=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));h=open(r+'/index.html',encoding='utf8').read()
h=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+open(r+'/'+m.group(1),encoding='utf8').read()+'</style>',h)
h=re.sub(r'<script src="((?!http)[^"]+)"></script>',lambda m:'<script>'+open(r+'/'+m.group(1),encoding='utf8').read()+'</script>',h)
os.makedirs(r+'/dist',exist_ok=True);open(r+'/dist/phu_sa_ky.html','w',encoding='utf8').write(h);print('dist/phu_sa_ky.html')
