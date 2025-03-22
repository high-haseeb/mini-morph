export const Footer = () => {
    return(
        <div className="border-t border-foreground/10 w-full flex items-center justify-center">
            <div className="p-4 flex items-center justify-between border-x border-x-foreground/10 w-[80%]">
                <div className="text-sm text-muted-foreground">Built by <a className="underline underline-offset-4" href="https://github.com/high-haseeb">high-haseeb</a>. Source code is available on <a href="https://github.com/high-haseeb/mini-morph" className="underline underline-offset-4">Github</a></div>
            </div>
        </div>
    )
}
