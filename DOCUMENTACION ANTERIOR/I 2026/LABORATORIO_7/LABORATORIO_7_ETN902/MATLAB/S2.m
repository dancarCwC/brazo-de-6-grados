% Código MATLAB para verificar controlabilidad y observabilidad
clear; clc;
% Matrices del sistema
A = [0, 1; 0, -3.764];
B = [0; 0.1642];
C = [1, 0];
% Matriz de controlabilidad
Co = ctrb(A, B);
det_Co = det(Co);
rank_Co = rank(Co);
fprintf('=== CONTROLABILIDAD ===\n');
fprintf('Matriz Co:\n');
disp(Co);
fprintf('Determinante de Co: %.4f\n', det_Co);
fprintf('Rango de Co: %d / %d\n', rank_Co, size(A,1));
if rank_Co == size(A,1)
fprintf('El sistema es COMPLETAMENTE CONTROLABLE\n\n');
elsefprintf('El sistema NO es completamente controlable\n\n');
end
% Matriz de observabilidad
Ob = obsv(A, C);
det_Ob = det(Ob);
rank_Ob = rank(Ob);
fprintf('=== OBSERVABILIDAD ===\n');
fprintf('Matriz Ob:\n');
disp(Ob);
fprintf('Determinante de Ob: %.4f\n', det_Ob);
fprintf('Rango de Ob: %d / %d\n', rank_Ob, size(A,1));
if rank_Ob == size(A,1)
fprintf('El sistema es COMPLETAMENTE OBSERVABLE\n');
elsefprintf('El sistema NO es completamente observable\n');
end
