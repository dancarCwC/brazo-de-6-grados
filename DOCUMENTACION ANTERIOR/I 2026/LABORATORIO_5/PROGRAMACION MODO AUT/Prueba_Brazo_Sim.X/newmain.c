/* 
 * File:   newmain.c
 * Author: BISMARK
 * Brazo Robótico 6 GDL 
 *
 * ==================== DESCRIPCION GENERAL ====================
 * Programa brazo robótico de 6 grados de libertad
 * 
 * CARACTERISTICAS PRINCIPALES:
 * - Modo manual: Control individual de cada motor mediante pulsadores
 * - Modo automatico: Ejecuta 5 secuencias preprogramadas al presionar START
 * - Anti-rebote: Filtra las lecturas de pulsadores para evitar falsos disparos
 * - Parada inmediata: El pulsador STOP detiene todos los motores al instante
 * - Homing: El pulsador RESET lleva todos los ejes a su posicion de home
 * 
 * SECUENCIAS DEL MODO AUTOMATICO (al presionar START):
 * - Secuencia 1: Mueve ejes 1, 2, 3 y 4 a posiciones especificas
 * - Secuencia 2: Mueve eje 2 hacia ABAJO, eje 3 hacia ARRIBA, eje 4 hacia ABAJO,
 *                y luego el eje 6 (pinza giratoria) gira hasta tope y regresa
 * - Secuencia 3: Movimientos combinados de ejes 1, 2, 4 y 6
 * - Secuencia 4: Movimientos de base izquierda, hombro, pinza giratoria y hombro
 * - Secuencia 5: Movimientos de base izquierda, hombro, pinza, muñeca, hombro y base derecha
 * =================================================================
 */

#include <pic.h>        // Libreria principal para microcontroladores PIC
                        // Incluye definiciones de registros y funciones

#define uchar unsigned char   // Definicion de unsigned char (0 a 255)
#define uint unsigned int     // Definicion de unsigned int (0 a 65535)

__CONFIG(0x3CE1);       // Palabra de configuracion del PIC (Fuses)
                        // 0x3CE1 configura: oscilador HS, watchdog off, etc.
#define _XTAL_FREQ 8000000  // Frecuencia del cristal: 8 MHz
                        // Necesaria para las funciones de delay __delay_ms()

//---------------------------
// DEFINICION DE BITS - ENTRADAS
// Los pines se configuran como entradas para leer:
// - Pulsadores del panel de control
// - Sensores de fin de carrera (home)
//---------------------------

#define kzx     RA0     // Pulsador BASE IZQUIERDA (conectado a RA0)
#define kyx     RA1     // Pulsador BASE DERECHA (conectado a RA1)
#define kss1    RA2     // Pulsador HOMBRO ARRIBA (conectado a RA2)
#define kxj1    RA3     // Pulsador HOMBRO ABAJO (conectado a RA3)
#define kss2    RA4     // Pulsador CODO ARRIBA (conectado a RA4)
#define kxj2    RA5     // Pulsador CODO ABAJO (conectado a RA5)
#define kss3    RB1     // Pulsador MUNECA ARRIBA (conectado a RB1)
#define kxj3    RB2     // Pulsador MUNECA ABAJO (conectado a RB2)
#define kszzx   RB3     // Pulsador PINZA CERRAR (conectado a RB3)
#define kszyx   RB4     // Pulsador PINZA ABRIR (conectado a RB4)
#define kzj     RB5     // Pulsador AGARRAR (gira pinza sentido 1)
#define kfs     RC0     // Pulsador SOLTAR (gira pinza sentido 2)
#define kaut    RC1     // Pulsador MODO AUTOMATICO (conectado a RC1)
#define kreset  RC3     // Pulsador RESET (homing)
#define kstart  RC4     // Pulsador START (inicia secuencia automatica)
#define kstop   RC5     // Pulsador STOP (detiene todo inmediatamente)

// Sensores de fin de carrera (home) - se activan a nivel BAJO (0)
#define s1      RD0     // Sensor HOME de la BASE
#define s2      RD1     // Sensor HOME del HOMBRO
#define s3      RD2     // Sensor HOME del CODO
#define s4      RD3     // Sensor HOME de la MUNECA
#define s5      RD4     // Sensor HOME de la PINZA (abrir/cerrar)
#define s6      RD5     // Sensor fin de carrera PINZA GIRATORIA (lado 1)
#define s7      RD6     // Sensor fin de carrera PINZA GIRATORIA (lado 2)

//---------------------------
// DEFINICION DE BITS - SALIDAS
// Los pines se configuran como salidas para controlar los motores
// Cada motor tiene dos señales: una para cada sentido de giro
//---------------------------

#define zx      RE0     // Motor BASE IZQUIERDA (RE0)
#define yx      RE1     // Motor BASE DERECHA (RE1)
#define xj1     RE2     // Motor HOMBRO ABAJO (RE2)
#define ss1     RE3     // Motor HOMBRO ARRIBA (RE3)
#define ss2     RE4     // Motor CODO ARRIBA (RE4)
#define xj2     RE5     // Motor CODO ABAJO (RE5)
#define ss3     RE6     // Motor MUNECA ARRIBA (RE6)
#define xj3     RF0     // Motor MUNECA ABAJO (RF0)
#define szzx    RF1     // Motor PINZA CERRAR (RF1)
#define szyx    RF2     // Motor PINZA ABRIR (RF2)
#define fs      RF3     // Motor SOLTAR (gira pinza en sentido contrario)
#define zj      RF4     // Motor AGARRAR (gira pinza en un sentido)

//---------------------------
// VARIABLES GLOBALES
//---------------------------

uchar run;      // Flag de control: 1 = secuencia automatica en ejecucion
                //                   0 = detenido
uchar reset;    // Flag de reset (no utilizado actualmente)
                
// Flags de limites de movimiento (evitan sobrepasar los topes mecanicos)
uchar zxxw,yxxw,xj1xw,ss1xw,xj2xw,ss2xw;
uchar ss3xw,xj3xw,szzxxw,szyxxw;

// Flags de posicion home (indican si cada eje esta en su posicion de home)
uchar zero1,zero2,zero3,zero4,zero5;

uchar rover=0;  // Flag de homing: 1 = ejecutar rutina de home
uchar pausa=0;  // Flag de pausa (no utilizado actualmente, reservado)

// Variables para anti-rebote: guardan el estado anterior de cada pulsador
// Se inicializan en 1 porque los pulsadores estan con pull-up (activos a nivel bajo 0)
uchar last_kzx=1, last_kyx=1;
uchar last_kss1=1, last_kxj1=1;
uchar last_kss2=1, last_kxj2=1;
uchar last_kss3=1, last_kxj3=1;
uchar last_kszzx=1, last_kszyx=1;
uchar last_kzj=1, last_kfs=1;

//---------------------------
// FUNCIONES DE DELAY
//---------------------------

// Delay en milisegundos (mas preciso)
// PARAMETROS: ms = milisegundos a esperar
void delay_ms(uint ms)
{
    uint i, j;
    for(i = 0; i < ms; i++) {
        for(j = 0; j < 100; j++) {
            NOP();      // Instruccion NOP (No Operation)
                        // Consume 1 ciclo de reloj, usada para ajustar timing
        }
    }
}

// Delay en segundos (aproximado, basado en ciclos de software)
// PARAMETROS: sec = segundos a esperar
// NOTA: Este delay es aproximado, calibrado para 8MHz
void delay(uint sec)
{
    uint i,j;
    j = sec * 30;       // Factor de escalado para 8MHz
    while(j--)
    {
        i = 1561;       // Valor calculado empiricamente para ~1 segundo
        while(--i);     // Bucle que consume tiempo
    }
}

//---------------------------
// INICIALIZACION DE PUERTOS
// Configura los pines del microcontrolador como entrada o salida
//---------------------------
void IO_init()
{
    TRISA = 0xff;       // Puerto A: TODOS los pines como ENTRADAS (pulsadores)
    ANSELA = 0x00;      // Deshabilitar entradas analogicas en puerto A
    
    TRISB = 0xff;       // Puerto B: TODOS como ENTRADAS
    TRISC = 0xff;       // Puerto C: TODOS como ENTRADAS
    APFCON = 0xff;      // Configurar pines alternativos (para funciones especiales como PWM)
    TRISD = 0xff;       // Puerto D: TODOS como ENTRADAS (sensores opticos)
    
    TRISE = 0x00;       // Puerto E: TODOS como SALIDAS (motores de potencia)
    ANSELE = 0x00;      // Deshabilitar entradas analogicas en puerto E
    
    TRISF = 0x00;       // Puerto F: TODOS como SALIDAS (motores adicionales)
    ANSELF = 0x00;      // Deshabilitar entradas analogicas en puerto F
    
    PORTE = 0x00;       // Inicializar salidas del puerto E en 0 (motores apagados)
    PORTF = 0x00;       // Inicializar salidas del puerto F en 0 (motores apagados)
}

//---------------------------
// INICIALIZACION DEL PWM
// Configura los modulos CCP (Capture/Compare/PWM) para control de velocidad
//---------------------------
void PWM_init()
{
    PR2 = 50;           // Periodo del PWM1: 50 x Tcy = 50 microsegundos
    CCP1CON = 0x0f;     // Configurar CCP1 en modo PWM (habilitar salida)
    CCPR1L = 25;        // Duty cycle 50% (valor 25 de 50)
    CCPTMRS0 = 0x00;    // Seleccionar Timer2 como base de tiempo para PWM1
    T2CON = 0x07;       // Encender Timer2 con prescaler 1:16
    TRISC2 = 0;         // Configurar pin RC2 como salida PWM
    
    PR4 = 50;           // Periodo del PWM2: 50 x Tcy
    CCP2CON = 0x0f;     // Configurar CCP2 en modo PWM
    CCPR2L = 25;        // Duty cycle 50%
    CCPTMRS0 = 0x04;    // Seleccionar Timer4 como base de tiempo para PWM2
    T4CON = 0x07;       // Encender Timer4 con prescaler 1:16
    
    APFCON = 0x04;      // Configuracion alternativa de pines para funciones especiales
    TRISE7 = 0;         // Configurar pin RE7 como salida
}

//---------------------------
// LECTURA DE SENSORES
// Actualiza las flags de posicion home segun el estado de los sensores
//---------------------------
void check()
{
    if(!s1) zero1 = 1;  // Si sensor s1 = 0 (activo) -> base en posicion home
    else zero1 = 0;     // Si sensor s1 = 1 (inactivo) -> base fuera de home
    
    if(!s2) zero2 = 1;  // Sensor s2 activo -> hombro en home
    else zero2 = 0;
    
    if(!s3) zero3 = 1;  // Sensor s3 activo -> codo en home
    else zero3 = 0;
    
    if(!s4) zero4 = 1;  // Sensor s4 activo -> muneca en home
    else zero4 = 0;
    
    if(!s5) zero5 = 1;  // Sensor s5 activo -> pinza en home (cerrada)
    else zero5 = 0;
}

//---------------------------
// MODO MANUAL
// Control individual de cada motor mediante pulsadores
// Incluye anti-rebote (filtro de 20ms) y limites de movimiento
//---------------------------
void hand()
{
    // ==================== BASE IZQUIERDA ====================
    // Si pulsador presionado (0) y no en limite de movimiento
    if(kzx == 0 && zxxw == 0)
    {
        // ANTI-REBOTE: esperar 20ms y verificar que sigue presionado
        if(last_kzx == 1) {
            delay_ms(20);
            if(kzx == 1) { last_kzx = kzx; return; }
        }
        zx = 1;         // Activar motor de base izquierda
        delay(1);       // Pulso de 1 segundo (movimiento discreto)
        zx = 0;         // Desactivar motor
        if(s1) { zero1 = 0; yxxw = 0; }  // Actualizar flags si se sale de home
        if(!zero1 && !s1) zxxw = 1;      // Activar flag de limite si no esta en home
    }
    else { zx = 0; }    // Apagar motor si no hay pulsador presionado
    last_kzx = kzx;     // Guardar estado actual para la proxima iteracion (anti-rebote)
    
    // ==================== BASE DERECHA ====================
    if(kyx == 0 && yxxw == 0)
    {
        if(last_kyx == 1) {
            delay_ms(20);
            if(kyx == 1) { last_kyx = kyx; return; }
        }
        yx = 1; delay(1); yx = 0;
        if(s1) { zero1 = 0; zxxw = 0; }
        if(!zero1 && !s1) yxxw = 1;
    }
    else { yx = 0; }
    last_kyx = kyx;
    
    // ==================== HOMBRO ARRIBA ====================
    if(kss1 == 0 && ss1xw == 0)
    {
        if(last_kss1 == 1) {
            delay_ms(20);
            if(kss1 == 1) { last_kss1 = kss1; return; }
        }
        ss1 = 1; delay(1); ss1 = 0;
        if(s2) { zero2 = 0; xj1xw = 0; }
        if(!zero2 && !s2) ss1xw = 1;
    }
    else { ss1 = 0; }
    last_kss1 = kss1;
    
    // ==================== HOMBRO ABAJO ====================
    if(kxj1 == 0 && xj1xw == 0)
    {
        if(last_kxj1 == 1) {
            delay_ms(20);
            if(kxj1 == 1) { last_kxj1 = kxj1; return; }
        }
        xj1 = 1; delay(1); xj1 = 0;
        if(s2) { zero2 = 0; ss1xw = 0; }
        if(!zero2 && !s2) xj1xw = 1;
    }
    else { xj1 = 0; }
    last_kxj1 = kxj1;
    
    // ==================== CODO ARRIBA ====================
    if(kss2 == 0 && ss2xw == 0)
    {
        if(last_kss2 == 1) {
            delay_ms(20);
            if(kss2 == 1) { last_kss2 = kss2; return; }
        }
        ss2 = 1; delay(1); ss2 = 0;
        if(s3) { zero3 = 0; xj2xw = 0; }
        if(!zero3 && !s3) ss2xw = 1;
    }
    else { ss2 = 0; }
    last_kss2 = kss2;
    
    // ==================== CODO ABAJO ====================
    if(kxj2 == 0 && xj2xw == 0)
    {
        if(last_kxj2 == 1) {
            delay_ms(20);
            if(kxj2 == 1) { last_kxj2 = kxj2; return; }
        }
        xj2 = 1; delay(1); xj2 = 0;
        if(s3) { zero3 = 0; ss2xw = 0; }
        if(!zero3 && !s3) xj2xw = 1;
    }
    else { xj2 = 0; }
    last_kxj2 = kxj2;
    
    // ==================== MUNECA ARRIBA ====================
    if(kss3 == 0 && ss3xw == 0)
    {
        if(last_kss3 == 1) {
            delay_ms(20);
            if(kss3 == 1) { last_kss3 = kss3; return; }
        }
        ss3 = 1; delay(1); ss3 = 0;
        if(s4) { zero4 = 0; xj3xw = 0; }
        if(!zero4 && !s4) ss3xw = 1;
    }
    else { ss3 = 0; }
    last_kss3 = kss3;
    
    // ==================== MUNECA ABAJO ====================
    if(kxj3 == 0 && xj3xw == 0)
    {
        if(last_kxj3 == 1) {
            delay_ms(20);
            if(kxj3 == 1) { last_kxj3 = kxj3; return; }
        }
        xj3 = 1; delay(1); xj3 = 0;
        if(s4) { zero4 = 0; ss3xw = 0; }
        if(!zero4 && !s4) xj3xw = 1;
    }
    else { xj3 = 0; }
    last_kxj3 = kxj3;
    
    // ==================== PINZA CERRAR ====================
    if(kszzx == 0 && szzxxw == 0)
    {
        if(last_kszzx == 1) {
            delay_ms(20);
            if(kszzx == 1) { last_kszzx = kszzx; return; }
        }
        szzx = 1; delay(2); szzx = 0;  // Pulso de 2 segundos para cerrar pinza
        if(s5) { zero5 = 0; szyxxw = 0; }
        if(!zero5 && !s5) szzxxw = 1;
    }
    else { szzx = 0; }
    last_kszzx = kszzx;
    
    // ==================== PINZA ABRIR ====================
    if(kszyx == 0 && szyxxw == 0)
    {
        if(last_kszyx == 1) {
            delay_ms(20);
            if(kszyx == 1) { last_kszyx = kszyx; return; }
        }
        szyx = 1; delay(2); szyx = 0;  // Pulso de 2 segundos para abrir pinza
        if(s5) { zero5 = 0; szzxxw = 0; }
        if(!zero5 && !s5) szyxxw = 1;
    }
    else { szyx = 0; }
    last_kszyx = kszyx;
    
    // ==================== AGARRAR (Girar pinza sentido 1) ====================
    // zj = gira la pinza en un sentido, solo si el sensor s6 esta activo (fin de carrera)
    if(kzj == 0 && s6)
    {
        if(last_kzj == 1) {
            delay_ms(20);
            if(kzj == 1) { last_kzj = kzj; return; }
        }
        zj = 1;         // Activar motor de giro de pinza
    }
    else { zj = 0; }
    last_kzj = kzj;
    
    // ==================== SOLTAR (Girar pinza sentido contrario) ====================
    // fs = gira la pinza en sentido opuesto, solo si el sensor s7 esta activo
    if(kfs == 0 && s7)
    {
        if(last_kfs == 1) {
            delay_ms(20);
            if(kfs == 1) { last_kfs = kfs; return; }
        }
        fs = 1;         // Activar motor de giro opuesto
    }
    else { fs = 0; }
    last_kfs = kfs;
}

//---------------------------
// RUTINA DE HOMING (RESTABLECIMIENTO)
// Lleva todos los ejes a su posicion de home usando sensores opticos
// Se ejecuta cuando se presiona el pulsador RESET
//---------------------------
void rest()
{
    if(rover)   // Solo si se activo el flag de reset
    {
        // BASE: mover hacia la derecha hasta activar sensor s1
        while(s1){ yx = 1; }    // Mientras s1=1 (no activo), continuar moviendo
        yx = 0;                 // Detener cuando s1=0 (home alcanzado)
        
        // HOMBRO: mover hacia arriba hasta activar sensor s2
        while(s2){ ss1 = 1; }
        ss1 = 0;
        
        // Pequenos ajustes para hombro (compensacion mecanica)
        xj1 = 1; delay(20); xj1 = 0;
        
        // Ajustes para codo
        xj2 = 1; delay(10); xj2 = 0;
        ss2 = 1; delay(10); ss2 = 0;
        
        // MUNECA: mover hacia arriba hasta activar sensor s4
        while(s4){ ss3 = 1; }
        ss3 = 0;
        xj3 = 1; delay(25); xj3 = 0;
        
        // PINZA (abrir/cerrar): cerrar hasta activar sensor s5
        while(s5){ szzx = 1; }  // Cerrar pinza hasta tope
        szzx = 0;
        szyx = 1; delay(20); szyx = 0;  // Pequeña apertura para liberar tension
        
        // PINZA GIRATORIA: girar hasta activar sensor s6
        while(s6){ zj = 1; }    // Girar hasta fin de carrera
        zj = 0;
    }
    rover = 0;  // Limpiar flag de homing
}

//---------------------------
// SECUENCIA 1: Posicionamiento inicial
// Mueve ejes 1, 2, 3 y 4 a posiciones especificas
//---------------------------
void secuencia1()
{
    // PASO 1: Mover EJE 1 (BASE) a la mitad de su recorrido
    if(!s1) {               // Si no esta en home actualmente
        yx = 1;             // Mover derecha hasta home primero
        while(!s1);         // Esperar a llegar a home
        yx = 0;
        delay(5);
    }
    
    zx = 1;                 // Activar motor base izquierda
    delay(16);              // Tiempo para llegar a la mitad del recorrido
    zx = 0;
    delay(5);
    
    // PASO 2: Mover EJE 2 (HOMBRO) hacia ARRIBA
    ss1 = 1;                // Activar motor hombro arriba
    delay(33);              // Tiempo para 1/4 del recorrido
    ss1 = 0;
    delay(5);
    
    // PASO 3: Mover EJE 3 (CODO)
    if(!s3) {               // Si el codo no esta en home
        ss2 = 1;            // Mover arriba hasta home
        while(!s3);         // Esperar a llegar
        ss2 = 0;
        delay(5);
    }
    
    xj2 = 1;                // Bajar codo un poco
    delay(10);
    xj2 = 0;
    delay(5);
    
    // PASO 4: Mover EJE 4 (MUNECA) hacia ARRIBA
    xj3 = 1;
    delay(55);
    xj3 = 0;
    delay(5);
    
    // Giro de pinza giratoria hasta el tope (usando sensor s6 como tope)
    while(s6) {             // Mientras el sensor s6 este activo
        zj = 1;             // Girar pinza
    }
    zj = 0;                 // Apagar motor al llegar al tope
}

//---------------------------
// SECUENCIA 2: Movimientos secundarios
// Mueve ejes 2, 3, 4 y el eje 6 (pinza giratoria)
//---------------------------
void secuencia2()
{
    // PASO 1: Mover EJE 2 (HOMBRO) hacia ABAJO
    xj1 = 1;                // Activar motor hombro abajo
    delay(50);              // Tiempo de movimiento
    xj1 = 0;
    delay(5);
    
    // PASO 2: Mover EJE 3 (CODO) hacia ARRIBA
    ss2 = 1;                // Activar motor codo arriba
    delay(78);
    ss2 = 0;
    delay(5);
    
    // PASO 3: Mover EJE 4 (MUNECA) hacia ABAJO
    ss3 = 1;                // Activar motor muneca abajo
    delay(40);
    ss3 = 0;
    delay(5);
    
    // PASO 4: EJE 6 (PINZA GIRATORIA) - Girar hasta el tope (sentido agarrar)
    while(s6) {             // Mientras sensor s6 activo
        zj = 1;             // Girar pinza sentido agarrar
    }
    zj = 0;
    delay(10);
    
    // PASO 5: EJE 6 - Regresar un poco (sentido contrario = soltar)
    fs = 1;                 // Activar motor giro opuesto
    delay(70);              // Tiempo de regreso (pequeño)
    fs = 0;
    delay(5);
}

//---------------------------
// SECUENCIA 3: Movimientos de hombro, base, muneca y pinza
//---------------------------
void secuencia3()
{
    // PASO 1: Mover EJE 2 (HOMBRO) hacia ARRIBA
    ss1 = 1;
    delay(28);
    ss1 = 0;
    delay(5);
    
    // PASO 2: Mover EJE 1 (BASE) hacia la DERECHA (movimiento pequeño)
    yx = 1;                 // Activar motor base derecha
    delay(15);              // Movimiento pequeño
    yx = 0;
    delay(5);
    
    // PASO 3: Mover EJE 2 (HOMBRO) hacia ABAJO
    xj1 = 1;                // Bajar hombro
    delay(40);
    xj1 = 0;
    delay(5);
    
    // PASO 4: EJE 6 (PINZA GIRATORIA) - Girar hasta tope
    while(s6) {
        zj = 1;
    }
    zj = 0;
    delay(10);
    
    // PASO 5: Mover EJE 4 (MUNECA) hacia ABAJO
    ss3 = 1;                // Bajar muneca
    delay(30);
    ss3 = 0;
    delay(5);
    
    // PASO 6: Mover EJE 2 (HOMBRO) hacia ARRIBA
    ss1 = 1;
    delay(40);
    ss1 = 0;
    delay(5);
}

//---------------------------
// SECUENCIA 4: Movimientos de base izquierda, hombro y pinza giratoria
//---------------------------
void secuencia4()
{
    // PASO 1: Mover EJE 1 (BASE) hacia la IZQUIERDA
    zx = 1;                 // Activar motor base izquierda
    delay(15);
    zx = 0;
    delay(5);
    
    // PASO 2: Mover EJE 2 (HOMBRO) hacia ABAJO
    xj1 = 1;                // Bajar hombro
    delay(40);
    xj1 = 0;
    delay(5);
    
    // PASO 3: EJE 6 (PINZA GIRATORIA) - Girar hasta tope
    while(s6) {
        zj = 1;
    }
    zj = 0;
    delay(10);
    
    // PASO 4: EJE 6 - Regresar un poco (sentido contrario)
    fs = 1;                 // Girar al lado contrario
    delay(70);              // Tiempo de regreso
    fs = 0;
    delay(5);
    
    // PASO 5: Mover EJE 2 (HOMBRO) hacia ARRIBA
    ss1 = 1;
    delay(30);
    ss1 = 0;
    delay(5);
}

//---------------------------
// SECUENCIA 5: Movimientos combinados finales
// Incluye base izquierda, hombro, pinza, muneca, hombro y base derecha
//---------------------------
void secuencia5()
{
    // PASO 1: Mover EJE 1 (BASE) hacia la IZQUIERDA
    zx = 1;                 // Activar motor base izquierda
    delay(20);
    zx = 0;
    delay(5);
    
    // PASO 2: Mover EJE 2 (HOMBRO) hacia ABAJO
    xj1 = 1;                // Bajar hombro
    delay(40);
    xj1 = 0;
    delay(5);
    
    // PASO 3: EJE 6 (PINZA GIRATORIA) - Girar hasta tope
    while(s6) {
        zj = 1;
    }
    zj = 0;
    delay(10);
    
    // PASO 4: Mover EJE 4 (MUNECA) hacia ABAJO
    ss3 = 1;                // Bajar muneca
    delay(20);
    ss3 = 0;
    delay(5);
    
    // PASO 5: Mover EJE 2 (HOMBRO) hacia ARRIBA
    ss1 = 1;
    delay(40);
    ss1 = 0;
    delay(5);
    
    // PASO 6: Mover EJE 1 (BASE) hacia la DERECHA (movimiento pequeño)
    yx = 1;                 // Activar motor base derecha
    delay(20);              // Movimiento pequeño
    yx = 0;
    delay(5);
}

//---------------------------
// MODO AUTOMATICO
// Ejecuta las cinco secuencias en orden secuencial
//---------------------------
void aut()
{
    secuencia1();           // Ejecutar primera secuencia
    delay(10);              // Pausa de 10 segundos entre secuencias
    
    secuencia2();           // Ejecutar segunda secuencia
    delay(10);              // Pausa entre secuencias
    
    secuencia3();           // Ejecutar tercera secuencia
    delay(10);              // Pausa entre secuencias
    
    secuencia4();           // Ejecutar cuarta secuencia
    delay(10);              // Pausa entre secuencias
    
    secuencia5();           // Ejecutar quinta secuencia
    
    // Finalizar modo automatico y apagar todos los motores
    run = 0;                // Desactivar flag de ejecucion
    PORTE = 0x00;           // Apagar todas las salidas del puerto E
    PORTF = 0x00;           // Apagar todas las salidas del puerto F
}

//---------------------------
// LECTURA DE PULSADORES DE CONTROL
// Monitorea los pulsadores START, STOP y RESET
//---------------------------
void keycan()
{
    if(kstart == 0)         // Si pulsador START presionado (nivel bajo)
    {
        run = 1;            // Activar flag de ejecucion de secuencias
        pausa = 1;
        delay(5);           // Delay anti-rebote
    }
    
    if(kstop == 0)          // Si pulsador STOP presionado (parada de emergencia)
    {
        run = 0;            // Detener ejecucion inmediatamente
        pausa = 0;
        PORTE = 0x00;       // Apagar todos los motores
        PORTF = 0x00;
        delay(5);           // Anti-rebote
    }
    
    if(kreset == 0)         // Si pulsador RESET presionado
        rover = 1;          // Activar flag de homing
}

//---------------------------
// PROGRAMA PRINCIPAL
// Bucle infinito que alterna entre modo manual y modo automatico
// La seleccion de modo se hace mediante el pulsador kaut
//---------------------------
void main()
{
    IO_init();              // Inicializar todos los puertos de E/S
    PWM_init();             // Inicializar modulos PWM para control de velocidad
    
    run = 0;                // Inicializar flag de ejecucion en 0 (detenido)
    rover = 0;              // Inicializar flag de homing en 0 (sin reset)
    
    while(1)                // Bucle infinito del programa principal
    {
        // ==================== MODO MANUAL ====================
        // Se ejecuta mientras el pulsador de modo automatico NO este presionado
        while(!kaut)        // Mientras kaut = 0 (modo manual)
        {
            keycan();       // Leer pulsadores START/STOP/RESET
            check();        // Leer sensores de home y actualizar flags
            hand();         // Ejecutar control manual por pulsadores individuales
        }
        
        // ==================== MODO AUTOMATICO ====================
        // Se ejecuta mientras el pulsador de modo automatico ESTE presionado
        while(kaut)         // Mientras kaut = 1 (modo automatico)
        {
            keycan();       // Leer pulsadores de control (START/STOP/RESET)
            
            if(rover == 1)  // Si se solicito reset (homing)
            {
                rest();     // Ejecutar rutina de homing
            }
            
            if(run == 1)    // Si se presiono START y no hay emergencia
            {
                aut();      // Ejecutar todas las secuencias automaticas
            }
            
            if(kstop == 0)  // Parada de emergencia (stop presionado)
            {
                run = 0;    // Detener ejecucion
                PORTE = 0x00;  // Apagar motores
                PORTF = 0x00;
            }
        }
    }
}