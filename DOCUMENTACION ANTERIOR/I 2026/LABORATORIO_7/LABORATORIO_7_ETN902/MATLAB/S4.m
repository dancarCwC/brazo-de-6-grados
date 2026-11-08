% =========================================================================
% Universidad Mayor de San Andrés - Facultad de Ingeniería
% ETN 902 / ETN 1034
% Diseño del Controlador por Realimentación de Estados
% =========================================================================
clear; clc; close all;
% 1. Definición del sistema (obtenido del Laboratorio 4)
A = [0, 1; 0, -3.764];
B = [0; 0.1642];
C = [1, 0];
% 2. Especificaciones de diseño
Mp = 0.05; % Sobreimpulso máximo 5%
ts = 1.0; % Tiempo de establecimiento 1 s
% 3. Cálculo de polos deseados
zeta = -log(Mp) / sqrt(pi^2 + log(Mp)^2);
wn = 4 / (zeta * ts);
s_deseados = [-zeta*wn + j*wn*sqrt(1-zeta^2), -zeta*wn - j*wn*sqrt(1-zeta^2)];
fprintf('=== POLOS DESEADOS ===\n');
fprintf('zeta = %.4f\n', zeta);
fprintf('wn = %.4f rad/s\n', wn);
fprintf('s1 = %.2f + j%.2f\n', real(s_deseados(1)), imag(s_deseados(1)));
fprintf('s2 = %.2f - j%.2f\n', real(s_deseados(2)), imag(s_deseados(2)));
% 4. Cálculo de K mediante Ackermann
K = acker(A, B, s_deseados);
fprintf('\n=== GANANCIAS DEL CONTROLADOR ===\n');
fprintf('K1 = %.2f\n', K(1));
fprintf('K2 = %.2f\n', K(2));
% 5. Matriz en lazo cerrado
A_cl = A - B*K;
% 6. Verificación de polos en lazo cerrado
polos_lc = eig(A_cl);
fprintf('\n=== POLOS EN LAZO CERRADO ===\n');
fprintf('s1 = %.4f + j%.4f\n', real(polos_lc(1)), imag(polos_lc(1)));
fprintf('s2 = %.4f - j%.4f\n', real(polos_lc(2)), imag(polos_lc(2)));
% 7. Cálculo de N (pre-compensación)
N = 1 / (C * inv(eye(2) - A_cl) * B);
fprintf('\n=== GANANCIA DE PRE-COMPENSACIÓN ===\n');
fprintf('N = %.4f\n', N);
fprintf('N (simplificado) = K1 = %.2f\n', K(1));
% 8. Diagrama de polos
figure;
pzmap(ss(A_cl, B, C, 0));
title('Polos del Sistema en Lazo Cerrado');
grid on;