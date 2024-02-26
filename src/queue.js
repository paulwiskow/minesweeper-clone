class Queue {
    constructor() {
        this.items = [];
    }

    enqeue(element) {
        this.items.push(element);
    }

    dequeue() {
        const res = this.items[0];
        this.items.splice(0, 1);

        return res;
    }

    isEmpty() {
        return this.items.length === 0;
    }
}