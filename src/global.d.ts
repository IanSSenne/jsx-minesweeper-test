declare namespace JSX {
    interface IntrinsicElements {
        [key: string]: any
    }
}
declare function html(name: string, props: { [key: string]: any } | null, ...children: (HTMLElement | Text)[]): HTMLElement