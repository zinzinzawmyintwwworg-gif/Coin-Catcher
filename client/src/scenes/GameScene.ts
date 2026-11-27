
import Phaser from 'phaser';

interface GameSceneData {
  username: string;
   token: string;
}

export class GameScene extends Phaser.Scene {
  private basket!: Phaser.Physics.Arcade.Sprite;
  private coins!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  private score = 0;
  private timeLeft = 30;
  private totalCoinsSpawned = 0;
private starCoinsSpawned = 0;
private starCoinsTarget = 0;

private scoreText!: Phaser.GameObjects.Text;
private timerText!: Phaser.GameObjects.Text;
  private gameTimer!: Phaser.Time.TimerEvent;
  private coinSpawnTimer!: Phaser.Time.TimerEvent;
  private username = '';
  private token = '';
  private difficulty: 'easy' | 'normal' | 'hard' = 'normal';
  private catchSound?: Phaser.Sound.BaseSound;
  private coinAudioContext?: AudioContext;
  private bgm?: Phaser.Sound.BaseSound;
  private isGameOver = false;

  constructor() {
    super('GameScene');
  }

  init(data: GameSceneData): void {
    this.username = data.username;
    this.token = data.token;
    this.difficulty = this.registry.get('difficulty') || 'normal';
    this.score = 0;
    this.totalCoinsSpawned = 0;
this.starCoinsSpawned = 0;
this.starCoinsTarget = Phaser.Math.Between(3, 4);

this.timeLeft = 30;
this.isGameOver = false;
  }

  create(): void {
    this.add.image(400, 300, 'background').setDisplaySize(800, 600);
 // Exit Game Button
const menuButton = this.add.text(780, 85, 'EXIT GAME', {
  fontSize: '15px',
  fontFamily: 'Arial',
  fontStyle: 'bold',
  color: '#ffffff',
  backgroundColor: '#dc626b',
  padding: { x: 12, y: 9 },
})
  .setOrigin(1, 0)
  .setInteractive({ useHandCursor: true });

menuButton.on('pointerover', () => {
  menuButton.setBackgroundColor('#bd4d58');
});

menuButton.on('pointerout', () => {
  menuButton.setBackgroundColor('#dc626b');
});

menuButton.on('pointerdown', () => {
  const returnToMainMenu = (window as any).returnToMainMenu;
  returnToMainMenu();
});


    // Score and Timer panels
    const scorePanel = this.add.graphics();
    scorePanel.fillStyle(0xffffff, 0.95);
    scorePanel.lineStyle(2, 0xddd4f5, 1);
    scorePanel.fillRoundedRect(20, 18, 175, 55, 14);
    scorePanel.strokeRoundedRect(20, 18, 175, 55, 14);

    const timerPanel = this.add.graphics();
    timerPanel.fillStyle(0xffffff, 0.95);
    timerPanel.lineStyle(2, 0xddd4f5, 1);
    timerPanel.fillRoundedRect(605, 18, 175, 55, 14);
    timerPanel.strokeRoundedRect(605, 18, 175, 55, 14);

    this.scoreText = this.add.text(36, 30, 'Score: 0', {
      fontSize: '23px',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      color: '#6652a5',
    });

   
this.timerText = this.add.text(764, 30, 'Time: 30', {
  fontSize: '23px',
  fontFamily: 'Arial',
  fontStyle: 'bold',
  color: '#6652a5',
}).setOrigin(1, 0);
    // Basket
    this.basket = this.physics.add.sprite(400, 550, 'basket');
    this.basket.setCollideWorldBounds(true);
    this.basket.setImmovable(true);
    this.basket.body!.setSize(80, 20).setOffset(10, 10);

    // Coins
    this.coins = this.physics.add.group({
      defaultKey: 'coin',
      maxSize: 20,
    });

    this.physics.add.overlap(
      this.basket,
      this.coins,
      this.catchCoin as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // Keyboard controls
    this.cursors = this.input.keyboard!.createCursorKeys();

    this.wasd = {
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // Sounds
    if (this.cache.audio.exists('catch')) {
      this.catchSound = this.sound.add('catch', { volume: 0.5 });
    }

    if (this.cache.audio.exists('bgm')) {
      this.bgm = this.sound.add('bgm', { volume: 0.3, loop: true });
      this.bgm.play();
    }

    // Game timer
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    // Coin spawning
    this.coinSpawnTimer = this.time.addEvent({
      delay: 800,
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true,
    });
  }

  update(): void {
    if (this.isGameOver) return;

    const speed = 500;

    if (this.cursors.left?.isDown || this.wasd.left.isDown) {
      this.basket.setVelocityX(-speed);
    } else if (this.cursors.right?.isDown || this.wasd.right.isDown) {
      this.basket.setVelocityX(speed);
    } else {
      this.basket.setVelocityX(0);
    }

    this.coins.getChildren().forEach((coin) => {
      const sprite = coin as Phaser.Physics.Arcade.Sprite;

      if (sprite.y > 650) {
        this.coins.killAndHide(sprite);
        sprite.body!.enable = false;
      }
    });
  }

  private spawnCoin(): void {
  if (this.isGameOver) return;

  const x = Phaser.Math.Between(50, 750);
  const coin = this.coins.get(x, -50) as Phaser.Physics.Arcade.Sprite;

  if (!coin) return;

  this.totalCoinsSpawned++;

  const remainingSpawns = 38 - this.totalCoinsSpawned;
  const remainingStars =
    this.starCoinsTarget - this.starCoinsSpawned;

  const shouldSpawnStar =
    remainingStars > 0 &&
    (
      remainingSpawns <= remainingStars ||
      Phaser.Math.Between(
        1,
        Math.max(1, remainingSpawns)
      ) <= remainingStars
    );

  let texture = 'coin';
  let points = 10;

  if (shouldSpawnStar) {
    texture = 'starCoin';
    points = 20;
    this.starCoinsSpawned++;
  } else {
    const coinType = Phaser.Math.Between(1, 100);

    if (coinType > 65) {
      texture = 'silverCoin';
      points = 5;
    }
  }

  coin.enableBody(true, x, -50, true, true);
  coin.setTexture(texture);
  coin.setData('points', points);

  const difficulty = this.registry.get('difficulty');

  let minSpeed = 200;
  let maxSpeed = 350;

  if (difficulty === 'easy') {
    minSpeed = 120;
    maxSpeed = 200;
  } else if (difficulty === 'hard') {
    minSpeed = 360;
    maxSpeed = 480;
  }

  coin.setVelocityY(Phaser.Math.Between(minSpeed, maxSpeed));
  coin.setScale(Phaser.Math.FloatBetween(0.8, 1.2));
}
private playCoinSound(): void {
  if (!this.coinAudioContext) {
    this.coinAudioContext = new AudioContext();
  }

  const context = this.coinAudioContext;

  if (context.state === 'suspended') {
    void context.resume();
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(950, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    1350,
    context.currentTime + 0.08
  );

  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 0.18);
}

  private catchCoin(
  _basket: Phaser.GameObjects.GameObject,
  coin: Phaser.GameObjects.GameObject
): void {
  if (this.isGameOver) return;

  const coinSprite = coin as Phaser.Physics.Arcade.Sprite;
  const points = coinSprite.getData('points') as number;

  this.coins.killAndHide(coinSprite);
  coinSprite.body!.enable = false;

  this.score += points;
  this.scoreText.setText(`Score: ${this.score}`);

  this.playCoinSound();

  this.tweens.add({
    targets: this.scoreText,
    scale: 1.2,
    duration: 100,
    yoyo: true,
    ease: 'Back.out',
  });
}

  private updateTimer(): void {
    if (this.isGameOver) return;

    this.timeLeft--;
    this.timerText.setText(`Time: ${this.timeLeft}`);

    if (this.timeLeft <= 10) {
      this.timerText.setColor('#dc626b');
    }

    if (this.timeLeft <= 0) {
      this.endGame();
    }
  }

  private endGame(): void {
    this.isGameOver = true;

    this.gameTimer.destroy();
    this.coinSpawnTimer.destroy();

    if (this.bgm) {
      this.bgm.stop();
    }

    this.coins.getChildren().forEach((coin) => {
      const sprite = coin as Phaser.Physics.Arcade.Sprite;
      sprite.setVelocityY(0);
    });

    this.time.delayedCall(500, () => {
      this.scene.start('GameOverScene', {
      username: this.username,
      score: this.score,
      token: this.token,
      difficulty: this.difficulty,
     });
    });
  }
}
