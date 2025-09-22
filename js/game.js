import { rulesGame } from './rulesGame.js';
import { gameOver } from './gameOver.js';
import saveTopResults from './saveTopResults.js';

export class Game {
    constructor() {
        this.fieldBox = document.querySelector(".field-box");
        this.field = document.querySelector(".field");
        this.numberEnemiesInfo = document.querySelector(".number-enemies");
        this.levelLifeInfo = document.querySelector(".level-life");
        this.numberInventoryInfo = document.querySelector(".number-inventory");
        this.numberStepsInfo = document.querySelector(".number-steps");
        this.numberPotionInfo = document.querySelector(".number-potion");
        this.numberAttacksInfo = document.querySelector(".number-attacks");
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.width = 40;
        this.height = 24;
        this.map = [];
        this.enemies = [];
        this.player = null;
        this.numberEnemies = 10;
        this.numberSteps = 0;
        this.numberPotio = 10;
        this.numberInventory = 0
        this.gameOver = false;
        this.corridors = [];
        this.numberAttacks = 0;
        this.numberHit = 0;
        this.isEnemieNear = false;
        this.numEnemiesNearby = 0;
        this.blockKeys = false;
        this.playerCoordinates = {
            x:null,
            y:null
        }
        this.potionPower = {
            min: 40,
            max: 50
        }
        this.playerParameters = {
            health: 100,
            minHealth: 0,
            maxHealth:100,
            lowHealth: 40,
            attackPower: 17,
        };
        this.enemieParametrs = {
            health: 100,
            attackPowerMin: 10,
            attackPowerMax: 15,
            attackPowerApproach: 3,
        }

        window.addEventListener("resize", () => {
            const previousTileSize = this.tileSize;

            this.updateTileSize();

            if (this.tileSize !== previousTileSize) {
                this.renderMap();
            }
        });
    }

    init() {
        this.removeControls();
        this.updateTileSize();
        this.generateMap();
        this.generateCorridors();
        this.generateRooms();
        this.placeItems();
        this.placePlayer();
        this.placeEnemies();
        this.renderMap();
        this.setupControls();
        this.checkEnemyAttacks();
        this.changedPlayerHealth();
        this.levelLifeInfo.textContent = this.playerParameters.health;
        this.numberEnemiesInfo.textContent = this.numberEnemies;
        this.numberInventoryInfo.textContent = this.numberInventory;
        this.numberStepsInfo.textContent = this.numberSteps;
        this.numberPotionInfo.textContent = this.numberPotio;
        this.numberAttacksInfo.textContent = this.numberAttacks;
        rulesGame(this);
    }

    createRandomNumberInRange (min, max){
        if (min > max) throw new Error("Минимальное значение больше максимального");
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    changedPlayerHealth (){
        let healthBar = document.querySelector(".tileP .health");
        healthBar.style.width = this.playerParameters.health;

        if (this.playerParameters.health >= this.playerParameters.maxHealth) this.playerParameters.health = 100; 
        if (this.playerParameters.health < this.playerParameters.minHealth) this.playerParameters.health = 0;

        // предупреждение о том, что мало здоровья
        if (this.playerParameters.health < this.playerParameters.lowHealth) {
            this.field.classList.add('low-health');
            this.levelLifeInfo.classList.add('low-health-text');
        } else {
            this.field.classList.remove('low-health');
            this.levelLifeInfo.classList.remove('low-health-text');
        }
       
        this.levelLifeInfo.textContent = this.playerParameters.health;
    }

    changedNumberSteps(){
        this.numberStepsInfo.textContent = this.numberSteps;
    }

    changedNumberInventory(){
        this.numberInventoryInfo.textContent = this.numberInventory;
    }

    changedNumberPotio(){
        this.numberPotionInfo.textContent = this.numberPotio;
    }

    changedNumberAttacks(){
        this.numberAttacksInfo.textContent = this.numberAttacks;
    }

    showDelayedConfirm(message) {
        setTimeout(() => {
            const restart = confirm(message);
            if (restart) {
                window.location.reload();
            }
        }, 200);
    }

    getUniqueRandomNumbers(count, max) {
        if (count > max + 1) throw new Error("Уникальных чисел ожидается больше чем max число");

        const numbers = new Set();
        while (numbers.size < count) {
            numbers.add(Math.floor(Math.random() * (max + 1)));
        }
    
        return Array.from(numbers);
    }

    updateTileSize() {
        if (window.innerWidth <= 1368) {
            this.tileSize = 20;
        } else if (window.innerWidth <= 1600) {
            this.tileSize = 25;
        } else {
            this.tileSize = 30;
        }
    }

    //1. Базовый каркас карты, заполняет все ячейки tileW
    generateMap() {
        this.map = Array.from({ length: this.height }, () => Array(this.width).fill("tileW"));
    }

    //2. Генерируем где будут коридоры
    generateCorridors() { 
        const corridorCount = this.createRandomNumberInRange(3, 5)
        const axisNumbersX = this.getUniqueRandomNumbers(corridorCount, this.width - 1)
        const axisNumbersY = this.getUniqueRandomNumbers(corridorCount, this.height - 1)

        for (let i = 0; i < corridorCount; i++) {
            let x = axisNumbersX[i];
            for (let y = 0; y < this.height; y++) {
                if(( y <= 15 && x <= 31)){
                    this.corridors.push(`${y}-${x}`)
                }
                this.map[y][x] = "tile-";
            }
        }

        for (let i = 0; i < corridorCount; i++) {
            let y = axisNumbersY[i];
            for (let x = 0; x < this.width; x++) {
                if(y <= 15 && x <= 31){
                    this.corridors.push(`${y}-${x}`)
                }
                this.map[y][x] = "tile-";
            }
        }
    }
    
    //3. Генерируем где будут комнаты 
    generateRooms() {
        const roomCount = this.createRandomNumberInRange(5, 10)
    
        for (let i = 0; i < roomCount; i++) {
            const randomIndex = Math.floor(Math.random() * this.corridors.length);
            const [firstTileY, firstTileX] = this.corridors[randomIndex].split('-').map(Number);
    
            let roomWidth = this.createRandomNumberInRange(3, 8);
            let roomHeight = this.createRandomNumberInRange(3, 8);
    
            // Проверяем, помещается ли комната в пределах карты
            if (firstTileX + roomWidth >= this.width || firstTileY + roomHeight >= this.height) continue;

            // Строим комнату начиная с указанной первой плитки
            for (let y = firstTileY; y < firstTileY + roomHeight; y++) {
                for (let x = firstTileX; x < firstTileX + roomWidth; x++) {
                    this.map[y][x] = "tile-";
                }
            }
        }
    }

    placeItems() {
        this.placeObject("tileSW", 2);
        this.placeObject("tileHP", 10);
    }

    placePlayer() {
        this.player = this.placeObject("tileP", 1)[0];
    }

    placeEnemies() {
        this.enemies = this.placeObject("tileE", this.numberEnemies).map(enemy => ({ ...enemy, health: this.enemieParametrs.health }));
    }

    //4. Генерируем где будут объекты (зелье, мечи) 
    placeObject(type, count) {
        let positions = [];
        while (positions.length < count) {
            let x = Math.floor(Math.random() * this.width);
            let y = Math.floor(Math.random() * this.height);

            if (this.map[y][x] === "tile-") {
                this.map[y][x] = type;
                positions.push({ x, y });
            }
        }
        return positions;
    }

    //5. Отрисовка игрового поля со всеми элементами
    renderMap() {
        this.field.innerHTML = "";
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = document.createElement("div");
                tile.style.left = `${x * this.tileSize}px`;
                tile.style.top = `${y * this.tileSize}px`;
                tile.style.width = `${this.tileSize}px`;
                tile.style.height = `${this.tileSize}px`;
                this.field.appendChild(tile);
                tile.classList.add("tile", this.map[y][x]);

                // Удаление игрока с поля
                if (x === this.playerCoordinates.x && y === this.playerCoordinates.y && this.playerParameters.health <= 0) {
                    tile.className = "tile tile-";
                }

                // Добавляем блок здоровья для игрока
                if (this.map[y][x] === "tileP"){
                    const healthBar = document.createElement("div");
                    healthBar.classList.add("health");
                    healthBar.style.width = `${this.playerParameters.health}%`;
                    tile.appendChild(healthBar);
                }

                // Добавляем блок здоровья для врага
                for(let i = 0; i < this.enemies.length; i++){
                    if(this.enemies[i].x === x && this.enemies[i].y === y){
                        const healthBar = document.createElement("div");
                        healthBar.classList.add("health");
                        healthBar.style.width = `${this.enemies[i].health}%`;
                        tile.appendChild(healthBar);
                    }
                }         
            } 
        }
    }

    handleKeyDown (e) {

        if (!this.blockKeys){
            let dx = 0, dy = 0;

            switch (e.code) {
                case 'KeyW': // Вверх
                    dy = -1
                    break;
                case 'KeyS': // Влево
                    dy = 1;;
                    break;
                case 'KeyA': // Вниз
                    dx = -1;
                    break;
                case 'KeyD': // Вправо
                    dx = 1;
                    break;
                case 'Space': // Атака
                    e.preventDefault();
                    this.isEnemieNear && this.attack();
                    return;
                default:
                    return;
            }

            if (dx || dy) this.movePlayer(dx, dy);
        }
    };

    setupControls() {
        document.addEventListener("keydown", this.handleKeyDown);
    }

    removeControls() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    movePlayer(dx, dy) {
        let newX = this.player.x + dx;
        let newY = this.player.y + dy;

        newX = Math.max(0, Math.min(newX, this.width - 1));
        newY = Math.max(0, Math.min(newY, this.height - 1));

        this.playerCoordinates.x = newX
        this.playerCoordinates.y = newY

        const updatePlayerPosition  = (newX, newY) => {
            this.map[this.player.y][this.player.x] = "tile-";
            this.player.x = newX;
            this.player.y = newY;
            this.map[newY][newX] = "tileP";
        };

        // когда переходим на пустой квадрат
        if (this.map[newY][newX] === "tile-") {
            updatePlayerPosition(newX, newY)
            this.numberSteps++;
            this.changedNumberSteps()
            this.moveEnemies()
            this.renderMap();
            this.checkEnemyAttacks();
        }

        // когда берем зелье
        if(this.map[newY][newX] === "tileHP"){
            updatePlayerPosition(newX, newY)
            this.playerParameters.health = this.playerParameters.health + this.createRandomNumberInRange(this.potionPower.min, this.potionPower.max);
            this.numberPotio --;
            this.changedNumberPotio();
            this.changedPlayerHealth();
            this.renderMap();
            this.checkEnemyAttacks();
        }

        // когда берем меч
        if (this.map[newY][newX] === "tileSW"){
            updatePlayerPosition(newX, newY)
            this.numberInventory ++;

            if(this.numberInventory === 1) this.playerParameters.attackPower = 25;
            if(this.numberInventory === 2) this.playerParameters.attackPower = 50;

            this.changedNumberInventory();
            this.renderMap();
            this.checkEnemyAttacks();
        }
    }
    
    moveEnemies() {
        this.enemies.forEach(enemy => {
            let distanceToPlayer = Math.abs(this.player.x - enemy.x) + Math.abs(this.player.y - enemy.y);
            let newX, newY;
            let moved = false;
    
            // eсли игрок в радиусе 5 клеток, враг преследует его
            if (distanceToPlayer <= 5) { 
                let dx = Math.sign(this.player.x - enemy.x);
                let dy = Math.sign(this.player.y - enemy.y);
                newX = enemy.x + dx;
                newY = enemy.y + dy;
                
                if (this.map[newY][newX] === "tile-") moved = true;
            }
    
            if (!moved) { 
                let directions = [
                    { dx: 0, dy: -1 },
                    { dx: 0, dy: 1 },
                    { dx: -1, dy: 0 },
                    { dx: 1, dy: 0 }
                ];

                for (let i = 0; i < directions.length; i++) {
                    let randomDir = directions[Math.floor(Math.random() * directions.length)];
                    newX = enemy.x + randomDir.dx;
                    newY = enemy.y + randomDir.dy;
                    newX = Math.max(0, Math.min(newX, this.width - 1));
                    newY = Math.max(0, Math.min(newY, this.height - 1));
                 
                    if (this.map[newY][newX] === "tile-") {
                        moved = true;
                        break;
                    }
                }
            }
    
            if (moved) {
                this.map[enemy.y][enemy.x] = "tile-";
                enemy.x = newX;
                enemy.y = newY;
                this.map[newY][newX] = "tileE";
            }
        });
    }

    // Проверяем, находится ли игрок рядом с врагом
   checkEnemyAttacks() {
    this.numEnemiesNearby = 0;
    let foundEnemyNearby = false;

    // Проходим по всем врагам без прерывания
    for (let i = 0; i < this.enemies.length; i++) {
        const enemy = this.enemies[i];
        const dx = Math.abs(enemy.x - this.player.x);
        const dy = Math.abs(enemy.y - this.player.y);
        
        if (dx <= 1 && dy <= 1) {
            foundEnemyNearby = true;
            this.numEnemiesNearby++; // Считаем всех врагов
        }
    }

    // Если есть хотя бы один враг рядом
    if (foundEnemyNearby) {

        // Наносим урон только если враг БЫЛ рядом и ОСТАЛСЯ рядом
        if (this.isEnemieNear) {
            this.numberSteps > 0 && (this.playerParameters.health -= this.enemieParametrs.attackPowerApproach);
        }
        
        this.isEnemieNear = true;
    } else {
        // Если врагов нет рядом - сбрасываем флаг
        this.isEnemieNear = false;
    }

    this.changedPlayerHealth();
    this.renderMap();
    this.checkGameOver();
}

    attack() { 
        // каждый второй удар по противнику отнимает здоровье у игрока (убрал эту логику, сейчас каждый удар у героя отнимает здоровье)
        if (this.isEnemieNear){
            this.numberHit++;
            this.numberAttacks++;

            if (this.numberHit > 0) {
                let damage = this.createRandomNumberInRange(this.enemieParametrs.attackPowerMin, this.enemieParametrs.attackPowerMax); 
                if (this.numEnemiesNearby > 1) damage += this.numEnemiesNearby * 3;
                this.playerParameters.health -= damage;
                this.numberHit = 0;
            }

            this.changedNumberAttacks();
        }
        
        this.enemies = this.enemies.filter(enemy => {
            if (Math.abs(enemy.x - this.player.x) <= 1 && Math.abs(enemy.y - this.player.y) <= 1) {
                enemy.health -= this.playerParameters.attackPower;
                this.changedPlayerHealth();

                if (enemy.health <= 0) {
                    this.map[enemy.y][enemy.x] = "tile-";
                    this.numberEnemies--;
                    this.numberEnemiesInfo.innerHTML = this.numberEnemies;
                    this.numberHit = 0;
                    this.isEnemieNear = false;
                    this.checkGameOver();
                    return false
                }
                this.checkGameOver();
            } 
            return true;
        });

        this.renderMap();
    }

    saveResultsTop

    checkGameOver() {
        if (this.playerParameters.health <= 0) {
            this.blockKeys = true
            this.gameOver = true;
            gameOver('Игра окончена! Вы погибли. Начать заново?')
            // this.showDelayedConfirm('Игра окончена! Вы погибли.\n\nНачать заново?');
        } else if (this.numberEnemies === 0) {
            this.blockKeys = true
            this.gameOver = true;
            saveTopResults(this.numberSteps, this.numberAttacks)
            gameOver('Поздравляем! Вы победили всех врагов! Начать заново?')
            // this.showDelayedConfirm('Поздравляем! Вы победили всех врагов!\n\nНачать заново?');
        }
    }  
}