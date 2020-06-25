function flat(a: any[]): any[] {
    return a.reduce((a, _) => [...a, ...Array.isArray(_) ? flat(_) : [_]], []);
}
export default function html(name: string, props: { [key: string]: any } | null, ...children: (HTMLElement | Text)[]): HTMLElement {
    const element = document.createElement(name);
    if (props) {
        for (const key in props) {
            if (key.startsWith("on")) {
                (<HTMLElement>element).addEventListener(key.substr(2), props[key]);
            } else {
                element.setAttribute(key, props[key].toString());
            }
        }
    }
    for (const child of flat(children)) {
        element.appendChild(child instanceof HTMLElement ? child : document.createTextNode(String(child)));
    }
    return element;
}