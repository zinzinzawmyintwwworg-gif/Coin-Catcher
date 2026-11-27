
import Phaser from 'phaser';

interface GameOverSceneData {
  username: string;
  score: number;
  token: string;
  difficulty: 'easy' | 'normal' | 'hard';
}
export class GameOverScene extends Phaser.Scene {
  private username = '';
  private token = '';
  private difficulty: 'easy' | 'normal' | 'hard' = 'normal';
  private score = 0;
  

  constructor() {
    super('GameOverScene');
  }

  init(data: GameOverSceneData): void {
    this.username = data.username;
    this.token = data.token;
    this.difficulty = data.difficulty || 'normal';
    this.score = data.score;
  }

  create(): void {
    this.add.image(400, 300, 'background').setDisplaySize(800, 600); 

// Dark background overlay
const overlay = this.add.graphics();
overlay.fillStyle(0x17142c, 0.65);
overlay.fillRect(0, 0, 800, 600);

// Card shadow
const shadow = this.add.graphics();
shadow.fillStyle(0x000000, 0.25);
shadow.fillRoundedRect(130, 45, 560, 530, 24);

// Main card
const card = this.add.graphics();
card.fillStyle(0x211d3b, 1);
card.lineStyle(2, 0xd6b65c, 0.9);
card.fillRoundedRect(120, 35, 560, 530, 24);
card.strokeRoundedRect(120, 35, 560, 530, 24);

// Gold accent line
const accent = this.add.graphics();
accent.fillStyle(0xe5bd55, 1);
accent.fillRoundedRect(280, 35, 240, 6, 3);

    // Game Over title
    this.add.text(400, 100, 'GAME OVER', {
      fontSize: '44px',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      color: '#f6ce62',
    }).setOrigin(0.5);

    this.add.text(400, 155, 'Nice try! Keep collecting coins.', {
      fontSize: '17px',
      fontFamily: 'Arial',
      color: '#c8c1df',
    }).setOrigin(0.5);

   
    // Player Information Card
    const playerCard = this.add.graphics();
    playerCard.fillStyle(0x30294d, 1);
    playerCard.lineStyle(2, 0x7963c8, 1);
    playerCard.fillRoundedRect(250, 190, 300, 60, 16);
    playerCard.strokeRoundedRect(250, 190, 300, 60, 16);

    this.add.text(400, 200, 'PLAYER', {
      fontSize: '12px',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      color: '#b9a9e8',
    }).setOrigin(0.5);

    this.add.text(400, 225, this.username, {
      fontSize: '18px',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Score Panel
    const scorePanel = this.add.graphics();
    scorePanel.fillStyle(0x30294d, 1);
    scorePanel.lineStyle(2, 0xe5bd55, 0.9);
    scorePanel.fillRoundedRect(250, 260, 300, 105, 16);
    scorePanel.strokeRoundedRect(250, 260, 300, 105, 16);

    this.add.text(400, 295, `${this.score}`, {
      fontSize: '64px',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      color: '#e5a928',
    }).setOrigin(0.5);

    this.add.text(400, 340, 'YOUR FINAL SCORE', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      color: '#9288ad',
    }).setOrigin(0.5);


    // Save score automatically
    void this.saveScore();

    // Play Again button
    const playAgainBtn = this.add.text(400, 415, 'PLAY AGAIN', {
      fontSize: '20px',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      color: '#211d3b',
      backgroundColor: '#e5bd55',
      padding: { x: 40, y: 15 },
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () =>
       playAgainBtn.setStyle({ backgroundColor: '#f3d77e' })
      )
      .on('pointerout', () =>
      playAgainBtn.setStyle({ backgroundColor: '#e5bd55' })
      )
      .on('pointerdown', () => this.restartGame());

    // Leaderboard button
    const leaderboardBtn = this.add.text(400, 475, 'LEADERBOARD', {
      fontSize: '18px',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      color: '#e6defa',
      backgroundColor: '#3b315e',
      padding: { x: 30, y: 13 },
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () =>
        leaderboardBtn.setStyle({ backgroundColor: '#514477' })
      )
      .on('pointerout', () =>
        leaderboardBtn.setStyle({ backgroundColor: '#3b315e' })
      )
      .on('pointerdown', () => {
  const openLeaderboard = (window as any).openLeaderboard;

  if (typeof openLeaderboard === 'function') {
    openLeaderboard('gameover');
  }
});

          // Main Menu button
    const mainMenuBtn = this.add.text(400, 530, 'MAIN MENU', {
      fontSize: '18px',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      color: '#e6defa',
      backgroundColor: '#342d50',
      padding: { x: 53, y: 11 },
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () =>
        mainMenuBtn.setStyle({ backgroundColor: '#514477' })
      )
      .on('pointerout', () =>
        mainMenuBtn.setStyle({ backgroundColor: '#342d50' })
      )
      .on('pointerdown', () => {
        const returnToMainMenu =
          (window as any).returnToMainMenu;

        if (typeof returnToMainMenu === 'function') {
          returnToMainMenu();
        }
      });

    this.input.keyboard?.once('keydown-SPACE', () => this.restartGame());
    this.input.keyboard?.once('keydown-ENTER', () => this.restartGame());
  }

  private async saveScore(): Promise<void> {
    const statusText = this.add.text(400, 380, 'Saving score...', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#9288ad',
    }).setOrigin(0.5);

    try {
      const response = await fetch('http://localhost:3000/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          username: this.username,
          points: this.score,
          difficulty: this.difficulty,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save score');
      }

      statusText.setText('Score saved successfully!');
      statusText.setColor('#5a9b79');

    } catch (error) {
      console.error('Error saving score:', error);
      statusText.setText('Could not save score!');
      statusText.setColor('#dc626b');
    }
  }

  private restartGame(): void {
    this.scene.start('GameScene', {
      username: this.username,
       token: this.token,
    });
  }

  
}
