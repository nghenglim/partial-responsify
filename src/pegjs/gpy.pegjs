start = head: (Section) tail: (AddiSection)* { return [head].concat(tail) }
value_separator = ","
begin_children = "{"
end_children = "}"
AddiField = (value_separator v: (Field) {return v})
ChildrenSection = begin_children head:(Section) tail:(AddiSection)* end_children {
return [head].concat(tail)
}
Section
= head:Field children:(ChildrenSection)*
    {
    return children.length ? [head].concat(children) : head;
    }
AddiSection = (value_separator v: (Section) {return v})
Field "field"
= [a-zA-Z][a-zA-Z0-9]* { return text(); }
