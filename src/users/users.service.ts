import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UsersService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'miguel.pruebas.t1000@gmail.com', // Reemplaza con tu correo
      pass: 'gvfzzkhnabsxlhqy', // Reemplaza con tu contraseña
    },
  });
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findAll() {
    return await this.userRepo.find();
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User not found.`);
    return user;
  }

  async create(data: CreateUserDto) {
    const newUser = this.userRepo.create(data);
    const passwordHash = await bcrypt.hash(newUser.password, 10);
    newUser.password = passwordHash;
    return await this.userRepo.save(newUser);
  }

  async update(id: number, changes: UpdateUserDto) {
    const user = await this.findOne(id);
    this.userRepo.merge(user, changes);
    return await this.userRepo.save(user);
  }

  async remove(id: number) {
    return await this.userRepo.delete(id);
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email } });
  }

  // para la recuperacion de contraseña
  async forgotPassword(email: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found.');

    // Generar el token y guardarlo en la base de datos
    const token = this.generateResetToken();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora de expiración
    await this.userRepo.save(user);

    // Enviar correo con el enlace de restablecimiento
    const resetLink = `http://localhost:3000/auth/update-password/${token}`;
    await this.sendResetPasswordEmail(user.email, resetLink);
    return { message: 'Email sent' };
  }

  private generateResetToken() {
    return uuidv4();
  }

  private async sendResetPasswordEmail(email: string, link: string) {
    const mailOptions = {
      from: 'miguel.pruebas.t1000@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      html: `<h1>To reset your password, please click on the link below:</h1>
               <a href="${link}">Reset Password</a>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  //para la verificacion del token
  async validateResetToken(token: string) {
    const user = await this.userRepo.findOne({
      where: { resetPasswordToken: token },
    });
    if (!user || user.resetPasswordExpires < new Date()) {
      throw new NotFoundException('Token is invalid or has expired');
    }
    return { valid: true };
  }

  //reestablecerrcontraseña
  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepo.findOne({
      where: { resetPasswordToken: token },
    });
    if (!user || user.resetPasswordExpires < new Date()) {
      throw new NotFoundException('Token is invalid or has expired');
    }

    // Actualizar la contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Eliminar el token de restablecimiento
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    return await this.userRepo.save(user);
  }
}
