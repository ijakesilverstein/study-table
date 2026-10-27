"""Check preservation and the independent arithmetic behind the twelve diagrams."""
from pathlib import Path
from fractions import Fraction
import base64,gzip,json,re
r=Path(__file__).resolve().parents[1]
data=json.loads((r/'source/slow-teaching-v118.json').read_text())
courses=json.loads((r/'source/full-courses-built.json').read_text())
encoded=re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',(r/'public/study-table-v117.html').read_text(),re.S)[1]
prior=json.loads(gzip.decompress(base64.b64decode(encoded)))
for course in courses.values():
 old=json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',prior[course['path']]['t'],re.S)[1])
 assert course==old,(course['subject'],'V117 course content was changed')
units={u['id']:u for c in courses.values() for u in c['units']}
assert set(data)=={'calculus-1','calculus-2','definite-integrals','physics-1','force-diagrams','circuit-paths'}
steps=0
for id,lesson in data.items():
 assert set(lesson)=={'first','second'}
 for which,spec in lesson.items():
  assert len(spec['steps'])==len(units[id][which]['steps'])
  assert len(spec['intro'].split())>=25
  for s in spec['steps']:
   assert s['note'] and s['button'] and s['caption'],(id,which)
   steps+=1
assert steps==39
v=data['calculus-1']['first']['values'];assert Fraction(v['s2']-v['s1'],v['t2']-v['t1'])==6
assert Fraction(v['s2']+100-(v['s1']+100),v['t2']-v['t1'])==6
v=data['calculus-1']['second']['values'];assert v['out']==v['back'] and Fraction(v['out']+v['back'],v['duration'])==4
assert 'illustration' in data['calculus-1']['second']['intro']
for h in [Fraction(1),Fraction(1,10),Fraction(1,100),Fraction(-1,10),Fraction(-1,100)]:
 assert ((3+h)**2-9)/h==6+h
assert [s['h'] for s in data['calculus-2']['first']['steps']]==[1,.1,.01,0]
v=data['calculus-2']['second']['values'];t=v['time'];assert v['curveCoefficient']*t*t==v['lineSlope']*t==9
assert 2*v['curveCoefficient']*t==6 and v['lineSlope']==3
for key,total,distance in [('first',8,8),('second',0,2)]:
 v=data['definite-integrals'][key]['values'];F=lambda t:Fraction(v['slope'],2)*t*t+v['intercept']*t
 assert F(v['b'])-F(v['a'])==total
 if key=='second':
  turn=Fraction(-v['intercept'],v['slope']);assert turn==1
  assert abs(F(turn)-F(v['a']))+abs(F(v['b'])-F(turn))==distance
v=data['physics-1']['first']['values'];assert Fraction(v['right']-v['left'],v['mass'])==4
assert -6+4*1==-2 # Rightward acceleration can slow an initially leftward cart.
v=data['physics-1']['second']['values'];assert v['right']==v['left'] and v['velocity']*3==6
for key,normal in [('first',20),('second',26)]:
 v=data['force-diagrams'][key]['values'];assert v['mass']*v['g']+v['push']==normal
for key in ['first','second']:
 v=data['circuit-paths'][key]['values'];V=Fraction(v['voltage']);r1=Fraction(v['r1']);r2=Fraction(v['r2'])
 if key=='first':
  current=V/(r1+r2);assert current==1 and current*r1==2 and current*r2==4
 else:
  assert V/r1==3 and V/r2==Fraction(3,2)
  assert V/(V/r1+V/r2)==Fraction(4,3)
words=sum(len(s['note'].split()) for lesson in data.values() for spec in lesson.values() for s in spec['steps'])
print(f'SLOW_TEACHING_DATA_PASS: all V117 course records exact; twelve cases, {steps} matched steps, {words} words of added step explanation; independent rates, areas, forces and circuits checked.')
