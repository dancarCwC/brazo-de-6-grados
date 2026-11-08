% Código MATLAB para análisis de robustez
% Variación de K_v
Kv_nominal = 0.0436;
Kv_variaciones = Kv_nominal * [0.8, 0.9, 1.0, 1.1, 1.2];

for i = 1:length(Kv_variaciones)
    num_s = 0.1642 * (Kv_variaciones(i)/Kv_nominal);
    Gs_var = tf(num_s, [1, 3.764, 0]);
    Gz_var = c2d(Gs_var, Ts, 'zoh');
    [A_var, B_var, C_var, D_var] = ssdata(Gz_var);
    A_cl_var = A_var - B_var*K;
    B_cl_var = B_var * N;
    sys_cl_var = ss(A_cl_var, B_cl_var, C_var, D_var, Ts);
    [y_var(:,i), t_var] = step(sys_cl_var, t_sim);
    info_var(i) = stepinfo(sys_cl_var);
end