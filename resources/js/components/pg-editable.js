export default (params) => ({
    theme: params.theme,
    editable: false,
    tableName: params.tableName ?? null,
    id: params.id ?? null,
    dataField: params.dataField ?? null,
    content: params.content,
    oldContent: null,
    fallback: params.fallback,
    errorBag: params.errorBag,
    init() {
        if (this.content.length === 0 && this.fallback) {
            this.content = this.fallback;
        }

        this.$watch('editable', (value) => {
            if (value) {
                this.oldContent = this.content;
                this.$nextTick(() => setTimeout(() => this.focus(), 50))
            }
        })
    },
    save() {
        if (this.$el.textContent === this.oldContent.toString()) {
            this.editable = false;

            return;
        }

        setTimeout(() => {
            console.log(this.$el.textContent)
            this.$wire.emit('pg:editable-' + this.tableName, {
                id: this.id,
                value: this.$el.textContent,
                field: this.dataField
            })
        }, 200)

        this.editable = false;
        this.content = this.htmlSpecialChars(this.$el.textContent)
    },
    focus() {
        const selection = window.getSelection();
        const range = document.createRange();
        selection.removeAllRanges();
        range.selectNodeContents(this.$refs.editable);
        range.collapse(false);
        selection.addRange(range);
        this.$refs.editable.focus();
    },
    cancel() {
        this.$refs.editable.textContent = this.oldContent;
        this.content = this.oldContent;
        this.editable = false;
    },
    htmlSpecialChars(string) {
        const el = document.createElement('div');
        el.innerText = string;
        return el.innerHTML;
    }
})
