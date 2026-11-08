% =========================================================================
% UNIVERSIDAD MAYOR DE SAN ANDRÉS - FACULTAD DE INGENIERÍA
% ETN 902 / ETN 1034 - SISTEMAS DE CONTROL II
% Script 3: Discretización del Sistema (Planta Variador-Motor-Encoder)
% =========================================================================

clear; clc; close all;

%% 1. Definición de la planta continua
num_s = 0.1642;
den_s = [1, 3.764, 0];
Gs = tf(num_s, den_s);

%% 2. Tiempo de muestreo (Configurado en el PLC S7-200 via SMB34)
Ts = 0.01; % 10 ms

%% 3. Discretización mediante Retenedor de Orden Cero (ZOH)
Gz = c2d(Gs, Ts, 'zoh');

%% 4. Mostrar función de transferencia discreta en consola
fprintf('==================================================\n');
fprintf('       FUNCIÓN DE TRANSFERENCIA DISCRETA G(z)     \n');
fprintf('==================================================\n');
disp(Gz);

%% 5. Obtener matrices en el espacio de estados discreto
[Ad, Bd, Cd, Dd] = ssdata(Gz);
fprintf('=== MATRICES EN ESPACIO DE ESTADOS (DISCRETO) ===\n');
fprintf('A_d =\n'); disp(Ad);
fprintf('B_d =\n'); disp(Bd);
fprintf('C_d =\n'); disp(Cd);
fprintf('D_d =\n'); disp(Dd);

%% 6. Polos del sistema discreto
polos = pole(Gz);
fprintf('=== POLOS DEL SISTEMA DISCRETO ===\n');
for i = 1:length(polos)
    fprintf('  z%d = %.4f\n', i, polos(i));
end
fprintf('==================================================\n');

%% 7. Gráfica 1: Comparación de respuestas (Continuo vs Discreto)
fig1 = figure(1);
set(fig1, 'Name', 'Comparación Continuo-Discreto', 'Color', 'w', 'Position', [100, 200, 650, 450]);
ax1 = axes(fig1);

% Usamos la respuesta al escalón guardando los datos para evitar que 'step' tome el control de la figura
[y_c, t_c] = step(Gs, 0:Ts:2.5);
[y_d, t_d] = step(Gz, 0:Ts:2.5);

plot(ax1, t_c, y_c, 'b-', 'LineWidth', 1.5); hold(ax1, 'on');
stem(ax1, t_d, y_d, 'r.', 'LineWidth', 1); 

title(ax1, '\bfComparación de Respuestas al Escalón: Sistema Continuo vs Discreto', 'FontSize', 11);
xlabel(ax1, 'Tiempo [s]', 'FontSize', 10);
ylabel(ax1, 'Posición [cuentas]', 'FontSize', 10);
legend(ax1, 'Sistema Continuo G(s)', 'Sistema Discreto G(z)', 'Location', 'NorthWest');
grid(ax1, 'on');
set(ax1, 'GridLineStyle', ':', 'GridAlpha', 0.6);

% Guardar la imagen automáticamente para el formato de tu informe en LaTeX
saveas(fig1, 'comparacion_cont_disc.png');

%% 8. Gráfica 2: Diagrama de polos y ceros en el plano Z (Requerido por tu LaTeX)
fig2 = figure(2);
set(fig2, 'Name', 'Plano Z', 'Color', 'w', 'Position', [780, 200, 500, 450]);
ax2 = axes(fig2);

% Forzamos a pzmap a dibujarse explícitamente en el segundo contenedor de ejes
pzmap(ax2, Gz);

grid(ax2, 'on');
title(ax2, '\bfDiagrama de Polos y Ceros en el Plano Z', 'FontSize', 11);
xlabel(ax2, 'Parte Real', 'FontSize', 10);
ylabel(ax2, 'Parte Imaginaria', 'FontSize', 10);
set(ax2, 'GridLineStyle', ':', 'GridAlpha', 0.6);

% Hacer que los marcadores de polos (x) y ceros (o) se vean más grandes en el reporte
set(findobj(ax2, 'Type', 'Line'), 'LineWidth', 2, 'MarkerSize', 9);

% Guardar la imagen automáticamente para el formato de tu informe en LaTeX
saveas(fig2, 'polos_z.png');