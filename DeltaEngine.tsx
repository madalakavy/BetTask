import { Delta } from './DeltaModel';

export class DeltaEngine {
    private deltas: (Delta | number)[];
    private dataset: Delta[] = [];
    private currentDeltaIndex = 0;
    private intervalId: any = null;

    constructor(deltas: (Delta | number)[], dataset: Delta[]) {
        this.deltas = deltas;
        this.dataset = dataset;
    }

    public startProcessing() {
        this.processNextDelta();
    }

    private processNextDelta() {
        if (this.currentDeltaIndex >= this.deltas.length) {
            // Stop processing when all deltas have been read
            return;
        }

        const current = this.deltas[this.currentDeltaIndex];

        if (typeof current === 'number') {
            this.intervalId = setTimeout(() => {
                this.currentDeltaIndex++;
                this.processNextDelta();
            }, current);
        } else {
            this.applyDelta(current as Delta);
            this.currentDeltaIndex++;
            setTimeout(() => {
                this.processNextDelta();
            }, 1000); // Add a small delay before processing the next delta to avoid stack overflow
        }
    }

    private applyDelta(delta: Delta) {
        const index = this.dataset.findIndex(item => item.Name === delta.Name);

        if (index !== -1) {
            this.dataset[index] = { ...this.dataset[index], ...delta };
            this.updateDOM(this.dataset[index]);
        } else {
            this.dataset.push(delta);
            this.addDOM(delta);
        }
    }

    private updateDOM(updatedItem: Delta) {
        const sanitizedSelector = this.sanitizeSelector(updatedItem.Name);
        const row = document.querySelector(`[data-name="${sanitizedSelector}"]`);

        if (row) {
            // Add a visual flare
            row.classList.add('financials__row--updated');
            setTimeout(() => {
                row.classList.remove('financials__row--updated');
            }, 1000); // Visual flare duration

            Object.keys(updatedItem).forEach((key) => {
                const cell = row?.querySelector(`.financials__cell--${key.toLowerCase()}`);
                if (cell) {
                    cell.textContent = updatedItem[key as keyof Delta] as string;
                }
            });
        }
    }

    private addDOM(newItem: Delta) {
        const sanitizedSelector = this.sanitizeSelector(newItem.Name);
        const table = document.querySelector('.financials__table tbody');
        if (table) {
            const row = document.createElement('tr');
            row.setAttribute('data-name', sanitizedSelector);
            row.classList.add('financials__row', 'financials__row--new');

            Object.keys(newItem).forEach(key => {
                const cell = document.createElement('td');
                cell.className = `financials__cell financials__cell--${key.toLowerCase()}`;
                cell.textContent = newItem[key as keyof Delta] as string;
                row.appendChild(cell);
            });

            table.appendChild(row);

            // Trigger the visual flare
            setTimeout(() => {
                row.classList.add('financials__row--updated');
                setTimeout(() => {
                    row.classList.remove('financials__row--updated');
                }, 1000); // Visual flare duration
            }, 1000);
        }
    }

    private sanitizeSelector(name: string): string {
        // Replace any characters that might break the selector with safe alternatives
        return name.replace(/[^a-zA-Z0-9-_]/g, '');
    }
}
