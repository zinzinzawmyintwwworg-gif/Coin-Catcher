
import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload(): void {
    // Placeholder assets are created in create()
  }

  create(): void {
    this.createPlaceholderAssets();

    const username = this.registry.get('username') as string;
    const token = this.registry.get('token') as string;

    this.scene.start('GameScene', {
      username,
      token,
    });
  }

  private createPlaceholderAssets(): void {
    const graphics = this.add.graphics();

    // Lavender background
    graphics.fillStyle(0xf7f4ff);
    graphics.fillRect(0, 0, 800, 600);

    // Soft decorative circles
    graphics.fillStyle(0xddd4f5, 0.35);
    graphics.fillCircle(80, 100, 45);
    graphics.fillCircle(700, 180, 60);
    graphics.fillCircle(620, 500, 35);
    graphics.fillCircle(180, 450, 50);

    graphics.generateTexture('background', 800, 600);

    // Cute pastel purple basket
    graphics.clear();

    // Basket body
    graphics.fillStyle(0x7963c8);
    graphics.fillRoundedRect(5, 7, 90, 21, 7);

    // Basket border
    graphics.lineStyle(2, 0x6652a5, 1);
    graphics.strokeRoundedRect(5, 7, 90, 21, 7);

    // Golden rim
    graphics.fillStyle(0xffc857);
    graphics.fillRoundedRect(0, 3, 100, 8, 4);

    // Basket inner area
    graphics.fillStyle(0xddd4f5);
    graphics.fillRoundedRect(12, 14, 76, 10, 3);

    // Basket lines
    graphics.lineStyle(2, 0x9a87d8, 1);
    graphics.lineBetween(30, 15, 30, 23);
    graphics.lineBetween(50, 15, 50, 23);
    graphics.lineBetween(70, 15, 70, 23);

    graphics.generateTexture('basket', 100, 30);

    // Classic Golden Coin
    graphics.clear();

    // Outer dark gold edge
    graphics.fillStyle(0x9c6815);
    graphics.fillCircle(16, 16, 16);

    // Main gold body
    graphics.fillStyle(0xe5a928);
    graphics.fillCircle(16, 16, 14);

    // Bright inner surface
    graphics.fillStyle(0xffd76a);
    graphics.fillCircle(16, 16, 11);

    // Inner engraved ring
    graphics.lineStyle(1.5, 0xc58a20, 1);
    graphics.strokeCircle(16, 16, 9);

    // Center circle
    graphics.fillStyle(0xf5b932);
    graphics.fillCircle(16, 16, 6);

    // Small embossed star
    graphics.fillStyle(0xfff0ad);
    graphics.fillPoints([
      new Phaser.Geom.Point(16, 10),
      new Phaser.Geom.Point(17.5, 14.5),
      new Phaser.Geom.Point(22, 16),
      new Phaser.Geom.Point(17.5, 17.5),
      new Phaser.Geom.Point(16, 22),
      new Phaser.Geom.Point(14.5, 17.5),
      new Phaser.Geom.Point(10, 16),
      new Phaser.Geom.Point(14.5, 14.5),
    ], true);

    // Top shine
    graphics.fillStyle(0xffffff, 0.65);
    graphics.fillCircle(11, 9, 2);

    graphics.generateTexture('coin', 32, 32);

    // Silver Coin
    graphics.clear();
    graphics.fillStyle(0x626d7a);
    graphics.fillCircle(16, 16, 16);

    graphics.fillStyle(0xb8c4d1);
    graphics.fillCircle(16, 16, 14);

    graphics.fillStyle(0xe7edf3);
    graphics.fillCircle(16, 16, 11);

    graphics.lineStyle(1.5, 0x8d99a8, 1);
    graphics.strokeCircle(16, 16, 9);

    graphics.fillStyle(0xaab6c4);
    graphics.fillCircle(16, 16, 6);

    graphics.fillStyle(0xffffff, 0.65);
    graphics.fillCircle(11, 9, 2);

    graphics.generateTexture('silverCoin', 32, 32);

    // Star Coin
    graphics.clear();
    graphics.fillStyle(0x6843a5);
    graphics.fillCircle(16, 16, 16);

    graphics.fillStyle(0x9b6de0);
    graphics.fillCircle(16, 16, 14);

    graphics.fillStyle(0xd8c3ff);
    graphics.fillCircle(16, 16, 11);

    graphics.lineStyle(1.5, 0x7447b7, 1);
    graphics.strokeCircle(16, 16, 9);

    graphics.fillStyle(0xffe16b);
    graphics.fillPoints([
      new Phaser.Geom.Point(16, 8),
      new Phaser.Geom.Point(18, 13),
      new Phaser.Geom.Point(24, 16),
      new Phaser.Geom.Point(18, 18),
      new Phaser.Geom.Point(16, 24),
      new Phaser.Geom.Point(14, 18),
      new Phaser.Geom.Point(8, 16),
      new Phaser.Geom.Point(14, 13),
    ], true);

    graphics.generateTexture('starCoin', 32, 32);

    // Catch effect
    graphics.clear();
    graphics.fillStyle(0xffc857, 0.5);
    graphics.fillCircle(50, 50, 45);

    graphics.generateTexture('catch', 100, 100);

    graphics.destroy();
  }
}
