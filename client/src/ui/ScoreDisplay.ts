import Phaser from 'phaser';

export class ScoreDisplay {
  private scene: Phaser.Scene;
  private scoreText: Phaser.GameObjects.Text;
  private timerText: Phaser.GameObjects.Text;
  private score = 0;
  private timeLeft = 30;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.scoreText = scene.add.text(20, 20, 'Score: 0', {
      fontSize: '28px',
      fontFamily: 'Arial Black',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 4,
    });

    this.timerText = scene.add.text(780, 20, 'Time: 30', {
      fontSize: '28px',
      fontFamily: 'Arial Black',
      color: '#e94560',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(1, 0);
  }

  addScore(points: number): void {
    this.score += points;
    this.scoreText.setText(`Score: ${this.score}`);

    this.scene.tweens.add({
      targets: this.scoreText,
      scale: 1.3,
      duration: 100,
      yoyo: true,
      ease: 'Back.out',
    });
  }

  setTime(seconds: number): void {
    this.timeLeft = seconds;
    this.timerText.setText(`Time: ${this.timeLeft}`);

    if (this.timeLeft <= 10) {
      this.timerText.setColor('#ff6b6b');
    }
  }

  getScore(): number {
    return this.score;
  }

  getTimeLeft(): number {
    return this.timeLeft;
  }

  destroy(): void {
    this.scoreText.destroy();
    this.timerText.destroy();
  }
}