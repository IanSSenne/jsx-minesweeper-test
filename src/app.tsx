import html from "./html";
const settings = { width: 20, height: 20, mines: 0 }
function Minefield(width: number, height: number, mines: number = 0) {
    mines = mines || width * height * 0.2 | 0
    let total_mines = mines;
    const mine_spots: string[] = [];
    const getId = () => Math.random().toString(36).substr(2);
    const mineId = getId();
    const settingId = getId();
    const cells: Map<string, Cell> = new Map<string, Cell>();
    class Cell {
        isFlipped: boolean = false;
        isFlagged: boolean = false;
        x: number;
        y: number;
        isMine: boolean = false;
        id: string = "";
        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }
        flag() {
            if (!this.isFlipped) {
                if (this.isFlagged) {
                    total_mines++;
                } else {
                    total_mines--;
                }
                updateMineCount();
                this.isFlagged = !this.isFlagged;
            }
            this.update();
        }
        flip(allow_empty: boolean = false) {
            if (this.isMine && !this.isFlipped) {
                this.isFlipped = true;
                for (let i = 0; i < mine_spots.length; i++) {
                    cells.get(mine_spots[i])?.flip();
                }
                this.update();
            } else if (!this.isFlagged && !this.isFlipped) {
                this.isFlipped = true;
                this.propigate(allow_empty);
                this.update();
            }
        }
        getClasses(): string {
            return ["cell", this.isFlagged && "is-flagged", this.isFlipped && (this.isMine ? "is-flipped is-mine" : "is-flipped")].filter(Boolean).join(" ");
        }
        getCount() {
            let count = 0;
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    const _x = this.x + x;
                    const _y = this.y + y;
                    if ((x != 0 || y != 0) && cells.get(_x + "-" + _y)?.isMine) {
                        count++;
                    }
                }
            }
            return count;
        }
        propigate(to_empty: boolean = false) {
            if (this.getCount() != 0 && !to_empty) {
                return;
            }
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (x != 0 || y != 0) {
                        const cell = cells.get((x + this.x) + "-" + (y + this.y));
                        if (cell && (!to_empty || cell.getCount() === 0) && !cell.isMine) {
                            cell.flip();
                        }
                    }
                }
            }
        }
        update() {
            const el = document.getElementById(this.id);
            if (el) {
                el.className = this.getClasses();
                if (this.isFlagged || !this.isFlipped) {
                    el.innerHTML = " ";
                } else {
                    el.innerHTML = this.isMine ? " " : String(this.getCount() || " ")
                }
            }
        }
    }
    function Tile({ x, y }: { x: number, y: number }) {
        const cell: Cell = new Cell(x, y);
        cells.set(x + "-" + y, cell);
        const button = getId();
        cell.id = button;
        return <button id={button} oncontextmenu={(evt: Event) => {
            evt.preventDefault();
            evt.stopPropagation();
        }} onmousedown={(evt: MouseEvent) => {
            evt.preventDefault();
            evt.stopPropagation();
            if (evt.button === 2) {
                cell.flag();
            } else {
                cell.flip(true);
            }
            cell.update();
            return false;
        }} class="cell" style={`--x:${x};--y:${y}`}></button>
    }


    const tiles = [];
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            tiles.push(Tile({ x, y }))
        }
    }



    let i = 0;
    while (mines > 0 && i < 1000) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        const index = x + "-" + y;
        const cell = cells.get(index);

        if (cell) {
            mines--;
            cell.isMine = true;
            mine_spots.push(index);
        }
        i++;
    }
    function updateMineCount() {
        const el = document.getElementById(mineId);
        if (el) el.innerHTML = total_mines.toString();
    }
    return <div class="app" style={`--width:${width};--height:${height};`}>
        <div class="topbar" style={`-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;`}
            unselectable="on"
            onselectstart={() => false}>
            <div class="remaining-mines" id={mineId}>
                {total_mines}
            </div>
            <button class="is-mine settings-button" onclick={() => {
                document.getElementById(settingId)?.classList.toggle("hidden");
            }}></button>
        </div>
        <div class="settings hidden" id={settingId}></div>
        <div class="minefield">{tiles}</div></div>
}

const init = () => {
    const mount = document.getElementById("app");
    mount?.appendChild(Minefield(settings.width, settings.height, settings.mines));
};
if (document.body) {
    init();
} else {
    window.addEventListener("DOMContentLoaded", init);
}