const V132_SPECIFIC=__SPECIFIC_TEACHING__;
function v132Guidance(context){return context.s.phase==='step'?V132_SPECIFIC[context.unit.id]?.[context.host.id==='courseSecond'?'second':'first']?.[context.s.index]:null}
