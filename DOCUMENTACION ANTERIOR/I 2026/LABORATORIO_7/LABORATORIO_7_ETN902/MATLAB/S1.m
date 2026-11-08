% =========================================================================
% UNIVERSIDAD MAYOR DE SAN ANDRÉS - FACULTAD DE INGENIERÍA
% ETN 902 / ETN 1034 - SISTEMAS DE CONTROL II
% Script 2: Análisis de Estabilidad, Controlabilidad y Observabilidad
% =========================================================================

clear; clc; close all;

%% 1. Definición de las matrices del sistema continuo (Lazo Abierto)
A = [0, 1; 0, -3.764];
B = [0; 0.1642];
C = [1, 0];
D = 0;

n = size(A, 1); % Orden del sistema (n = 2)

%% 2. Análisis de Estabilidad en Lazo Abierto (Autovalores)
polos_la = eig(A);

fprintf('==================================================\n');
fprintf('         ANÁLISIS DE ESTABILIDAD EN LAZO ABIERTO  \n');
fprintf('==================================================\n');
fprintf('Polos en lazo abierto (s):\n');
for i = 1:length(polos_la)
    fprintf('  s%d = %.4f\n', i, polos_la(i));
end

if any(real(polos_la) > 0)
    fprintf('Resultado: El sistema es INESTABLE.\n');
elseif any(real(polos_la) == 0)
    fprintf('Resultado: El sistema es MARGINALMENTE ESTABLE (debido al integrador).\n');
else
    fprintf('Resultado: El sistema es ASINTÓTICAMENTE ESTABLE.\n');
end
fprintf('--------------------------------------------------\n');

%% 3. Gráfica 1: Mapa de Polos y Ceros en Lazo Abierto
figure('Name', 'Mapa de Polos Lazo Abierto', 'Color', 'w', 'Position', [100, 100, 550, 450]);
sys_la = ss(A, B, C, D);
pzplot(sys_la);
grid on;
title('\bfMapa de Polos y Ceros (Lazo Abierto)', 'FontSize', 12);
xlabel('Eje Real (\sigma)', 'FontSize', 11);
ylabel('Eje Imaginario (j\omega)', 'FontSize', 11);
set(gca, 'GridLineStyle', ':', 'GridAlpha', 0.6, 'FontSize', 10);

% Personalizar los marcadores de los polos para que se vean grandes y claros
set(findobj(gca, 'Type', 'Line'), 'LineWidth', 2, 'MarkerSize', 10);

%% 4. Análisis de Estabilidad mediante el Teorema de Lyapunov y Gráfica 2
Q = eye(n); % Matriz identidad definida positiva

try
    % Intentamos resolver A'*P + P*A = -Q
    P = lyap(A', Q); 
    eig_P = eig(P);
    
    fprintf('=== ANÁLISIS DE LYAPUNOV ===\n');
    fprintf('Autovalores de la matriz P:\n');
    disp(eig_P);
    
    % Si logra resolverlo, graficamos la función candidato de Lyapunov V(x) = x'*P*x
    figure('Name', 'Superficie de Lyapunov', 'Color', 'w', 'Position', [670, 100, 600, 450]);
    [X1, X2] = meshgrid(-2:0.1:2, -2:0.1:2);
    V = P(1,1)*X1.^2 + (P(1,2)+P(2,1))*X1.*X2 + P(2,2)*X2.^2;
    
    mesh(X1, X2, V);
    colorbar;
    title('\bfFunción Candidato de Lyapunov V(x) = x^T P x', 'FontSize', 12);
    xlabel('Estado x_1 (Posición)', 'FontSize', 11);
    ylabel('Estado x_2 (Velocidad)', 'FontSize', 11);
    zlabel('V(x)', 'FontSize', 11);
    view(-37.5, 30); % Ajustar perspectiva tridimensional
    
catch ME
    fprintf('=== ANÁLISIS DE LYAPUNOV ===\n');
    fprintf('Aviso: La ecuación de Lyapunov no tiene solución definida positiva.\n');
    fprintf('Esto confirma matemáticamente que el sistema NO es asintóticamente estable en L.A.\n');
    
    % Graficamos qué pasa con la energía si usamos una P calculada con una pequeña aproximación estable
    % (Solo con fines pedagógicos para ilustrar la inestabilidad en tu informe)
    A_aprox = A; A_aprox(2,1) = -0.001; % Pequeña perturbación para estabilizar numéricamente
    P_aprox = lyap(A_aprox', Q);
    
    figure('Name', 'Superficie de Lyapunov (Inestabilidad)', 'Color', 'w', 'Position', [670, 100, 600, 450]);
    [X1, X2] = meshgrid(-5:0.2:5, -5:0.2:5);
    V = P_aprox(1,1)*X1.^2 + (P_aprox(1,2)+P_aprox(2,1))*X1.*X2 + P_aprox(2,2)*X2.^2;
    
    surf(X1, X2, V, 'EdgeColor', 'none');
    colormap('jet'); colorbar;
    title('\bfComportamiento de la Energía V(x) en Lazo Abierto', 'FontSize', 12);
    subtitle('Se observa que el canal del integrador (x_1) tiende a infinito', 'FontAngle', 'italic');
    xlabel('Estado x_1 (Posición)', 'FontSize', 11);
    ylabel('Estado x_2 (Velocidad)', 'FontSize', 11);
    zlabel('V(x)', 'FontSize', 11);
    view(-15, 20);
end
fprintf('--------------------------------------------------\n');

%% 5. Análisis de Controlabilidad
Co = ctrb(A, B);
det_Co = det(Co);
rank_Co = rank(Co);

fprintf('=== ANÁLISIS DE CONTROLABILIDAD ===\n');
fprintf('Matriz de Controlabilidad (Co):\n');
disp(Co);
fprintf('Determinante de Co: %.5f\n', det_Co);
fprintf('Rango de Co: %d (Requerido: %d)\n', rank_Co, n);

if rank_Co == n
    fprintf('Resultado: El sistema es COMPLETAMENTE CONTROLABLE. ¡Es factible diseñar realimentación!\n');
else
    fprintf('Resultado: El sistema NO es completamente controlable.\n');
end
fprintf('--------------------------------------------------\n');

%% 6. Análisis de Observabilidad
Ob = obsv(A, C);
det_Ob = det(Ob);
rank_Ob = rank(Ob);

fprintf('=== ANÁLISIS DE OBSERVABILIDAD ===\n');
fprintf('Matriz de Observabilidad (Ob):\n');
disp(Ob);
fprintf('Determinante de Ob: %.5f\n', det_Ob);
fprintf('Rango de Ob: %d (Requerido: %d)\n', rank_Ob, n);

if rank_Ob == n
    fprintf('Resultado: El sistema es COMPLETAMENTE OBSERVABLE.\n');
else
    fprintf('Resultado: El sistema NO es completamente observable.\n');
end
fprintf('==================================================\n');