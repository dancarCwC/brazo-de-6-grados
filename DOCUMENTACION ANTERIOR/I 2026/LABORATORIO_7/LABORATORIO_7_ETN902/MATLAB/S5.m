% =========================================================================
% UNIVERSIDAD MAYOR DE SAN ANDRÉS - FACULTAD DE INGENIERÍA
% ETN 902 / ETN 1034 - SISTEMAS DE CONTROL II
% Script 4 (CORREGIDO): Simulación Estable en Lazo Cerrado
% =========================================================================

clear; clc; close all;

%% 1. Parámetros del sistema continuo (Identificados)
num_s = 0.1642;
den_s = [1, 3.764, 0];
% Gs = b / (s^2 + a*s) -> a = 3.764, b = 0.1642
a = 3.764; 
b = 0.1642;

Ts = 0.01; % Tiempo de muestreo

%% 2. Construcción ANALÍTICA exacta de las matrices discretas
% Esto garantiza que: x1 = Posición [cuentas], x2 = Velocidad [cuentas/s]
A = [1,  (1 - exp(-a*Ts))/a;
    0,  exp(-a*Ts)];

B = [ (b*Ts)/a - (b*(1 - exp(-a*Ts)))/(a^2);
    (b*(1 - exp(-a*Ts)))/a ];

C = [1, 0]; % Medimos posición directamente
D = 0;
n = size(A, 1);

%% 3. Vector de ganancias calculado a mano
% Asegúrate de que el orden sea [K_posicion, K_velocidad]
K = [204.87, 25.78]; 

%% 4. Cálculo formal de la ganancia de pre-compensación N
I = eye(n);
N = 1 / (C * ((I - (A - B*K)) \ B)); 

%% 5. Simulación dinámica acoplada paso a paso
t_sim = 0:Ts:2.5;
N_steps = length(t_sim);

x = zeros(n, N_steps);   
y_fb = zeros(1, N_steps); 
u_fb = zeros(1, N_steps); 
r = ones(1, N_steps);     

for k = 1:N_steps
    % Ecuación de salida real
    y_fb(k) = C * x(:,k);

    % Ley de control
    u_fb(k) = -K * x(:,k) + N * r(k);

    % Evolución de estados
    if k < N_steps
        x(:,k+1) = A * x(:,k) + B * u_fb(k);
    end
end

%% 6. Métricas de desempeño en lazo cerrado
info_fb = stepinfo(y_fb, t_sim, 1);

fprintf('==================================================\n');
fprintf('     MÉTRICAS DE DESEMPEÑO - LAZO CERRADO         \n');
fprintf('==================================================\n');
fprintf('Sobreimpulso (Mp)             : %.2f %%\n', info_fb.Overshoot);
fprintf('Tiempo de Subida (Tr)         : %.3f s\n', info_fb.RiseTime);
fprintf('Tiempo de Establecimiento (ts): %.3f s\n', info_fb.SettlingTime);
fprintf('Valor Final obtenido          : %.4f\n', y_fb(end));
fprintf('==================================================\n');

%% 7. Gráfica 1: Respuesta Temporal (Posición del Encoder)
fig1 = figure(1);
set(fig1, 'Name', 'Respuesta Temporal', 'Color', 'w', 'Position', [100, 200, 600, 450]);
ax1 = axes(fig1);

plot(ax1, t_sim, y_fb, 'b-', 'LineWidth', 2); hold(ax1, 'on');
plot(ax1, t_sim, r, 'r--', 'LineWidth', 1.5);

title(ax1, '\bfRespuesta al Escalón - Realimentación de Estados', 'FontSize', 12);
xlabel(ax1, 'Tiempo [s]', 'FontSize', 11);
ylabel(ax1, 'Posición [cuentas]', 'FontSize', 11);
legend(ax1, 'Salida y[k]', 'Referencia r[k]', 'Location', 'SouthEast');
grid(ax1, 'on');
set(ax1, 'GridLineStyle', ':', 'GridAlpha', 0.6, 'XLim', [0, 2.5]); 
% Quitamos el ylim forzado para que veas la curva real acomodarse

%% 8. Gráfica 2: Señal de Acción de Control
fig2 = figure(2);
set(fig2, 'Name', 'Señal de Control', 'Color', 'w', 'Position', [720, 200, 600, 450]);
ax2 = axes(fig2);

stairs(ax2, t_sim, u_fb, 'g-', 'LineWidth', 2);

title(ax2, '\bfSeñal de Control - Realimentación de Estados', 'FontSize', 12);
xlabel(ax2, 'Tiempo [s]', 'FontSize', 11);
ylabel(ax2, 'Acción de Control u[k]', 'FontSize', 11);
grid(ax2, 'on');
set(ax2, 'GridLineStyle', ':', 'GridAlpha', 0.6, 'XLim', [0, 2.5]);