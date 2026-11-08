/*
 * File:   comunicacion.c
 * Author: marc0
 *
 * Created on December 7, 2023, 7:57 AM
 */


// PIC16F877A Configuration Bit Settings

// 'C' source line config statements

// CONFIG
#pragma config FOSC = XT        // Oscillator Selection bits (XT oscillator)
#pragma config WDTE = OFF       // Watchdog Timer Enable bit (WDT disabled)
#pragma config PWRTE = ON       // Power-up Timer Enable bit (PWRT enabled)
#pragma config BOREN = ON       // Brown-out Reset Enable bit (BOR enabled)
#pragma config LVP = OFF        // Low-Voltage (Single-Supply) In-Circuit Serial Programming Enable bit (RB3 is digital I/O, HV on MCLR must be used for programming)
#pragma config CPD = OFF        // Data EEPROM Memory Code Protection bit (Data EEPROM code protection off)
#pragma config WRT = OFF        // Flash Program Memory Write Enable bits (Write protection off; all program memory may be written to by EECON control)
#pragma config CP = OFF         // Flash Program Memory Code Protection bit (Code protection off)

// #pragma config statements should precede project file includes.
// Use project enums instead of #define for ON and OFF.

#define RS PORTDbits.RD2
#define EN PORTDbits.RD3
#define D4 PORTDbits.RD4
#define D5 PORTDbits.RD5
#define D6 PORTDbits.RD6
#define D7 PORTDbits.RD7

#define RS_DIR TRISDbits.TRISD2
#define EN_DIR TRISDbits.TRISD3
#define D4_DIR TRISDbits.TRISD4
#define D5_DIR TRISDbits.TRISD5
#define D6_DIR TRISDbits.TRISD6
#define D7_DIR TRISDbits.TRISD7

#define _XTAL_FREQ 4000000
#include <xc.h>
#include <stdio.h>
#include<stdlib.h>
char buffer[20];
void UART_init(void)
{
    TRISCbits.TRISC7 = 1;//rx entrada
    TRISCbits.TRISC6 = 0;//TX SALIDA
    TXSTAbits.SYNC = 0;//SE TRABAJA EN UART
    TXSTAbits.TX9 = 0 ;//8 BITS
    TXSTAbits.BRGH = 1 ;//SE ESCOJE ALTA VELOCDAD
    SPBRG = 25;//DETERMINA LA VELOCIDAD 9600 BAUDIOS para 20MHZ
    RCSTAbits.SPEN = 1;//HABILITA PUERTO SERIAL
    TXSTAbits.TXEN = 1; //TRANSMISION HABILITADA
    RCSTAbits.CREN = 1; //rx encendido
}
char UART_read(void)//recepcion
{//el buffer RCREG SE ENCARGA DE DETENER EL DATO
    if(PIR1bits.RCIF == 1)//PIR1bits.RCIF  SE PONE A 1 CUANDO LLEGA UN DATO VALIDO
        
        return RCREG;
    else
        return 0;
    
}
void UART_write(char dato)
{
    TXREG = dato; // DATO QUER SE ENVIA POR UN BUFFER
    while(TXSTAbits.TRMT ==0);//cambia el estado de registro de transmision
}
void UART_printf(unsigned char* cadena)
{
    while(*cadena != 0x00){
        UART_write(*cadena);
        cadena++;
    }
    
}

void Lcd_Port(char a)
{
    (a & 1) ? (D4 = 1) : (D4 = 0);
    (a & 2) ? (D5 = 1) : (D5 = 0);
    (a & 4) ? (D6 = 1) : (D6 = 0);
    (a & 8) ? (D7 = 1) : (D7 = 0);
}

void Lcd_Cmd(char a)
{
    RS = 0;
    Lcd_Port(a);
    EN = 1;
    __delay_ms(4);
    EN = 0;
}

void Lcd_Clear(void)
{
    Lcd_Cmd(0);
    Lcd_Cmd(1);
}

void Lcd_Set_Cursor(char a, char b)
{
    char temp,z,y;
    if(a == 1)
    {
        temp = 0x80 + b - 1;
        z = temp>>4;
        y = temp & 0x0F;
        Lcd_Cmd(z);
        Lcd_Cmd(y);
    }
    else if(a == 2)
    {
        temp = 0xC0 + b - 1;
        z = temp>>4;
        y = temp & 0x0F;
        Lcd_Cmd(z);
        Lcd_Cmd(y);
    }
    else if(a == 3)
    {
        temp = 0x94 + b - 1;
        z = temp>>4;
        y = temp & 0x0F;
        Lcd_Cmd(z);
        Lcd_Cmd(y);
    }
    else if(a == 4)
    {
        temp = 0xD4 + b - 1;
        z = temp>>4;
        y = temp & 0x0F;
        Lcd_Cmd(z);
        Lcd_Cmd(y);
    }
}

void Lcd_Init(void)
{
	RS_DIR = 0;
	EN_DIR = 0;
	D4_DIR = 0;
	D5_DIR = 0;
	D6_DIR = 0;
	D7_DIR = 0;
    Lcd_Port(0x00);
    __delay_ms(20);
    Lcd_Cmd(0x03);
    __delay_ms(5);
    Lcd_Cmd(0x03);
    __delay_ms(11);
    Lcd_Cmd(0x03);
    Lcd_Cmd(0x02);
    Lcd_Cmd(0x02);
    Lcd_Cmd(0x08);
    Lcd_Cmd(0x00);
    Lcd_Cmd(0x0C);
    Lcd_Cmd(0x00);
    Lcd_Cmd(0x06);
    Lcd_Clear();
}

void Lcd_Write_Char(char a)
{
    char temp,y;
    temp = a&0x0F;
    y = a&0xF0;
    RS = 1;
    Lcd_Port(y>>4);
    EN = 1;
    __delay_us(40);
    EN = 0;
    Lcd_Port(temp);
    EN = 1;
    __delay_us(40);
    EN = 0;
}

void Lcd_Write_String(const char *a)
{
    int i;
    for(i=0;a[i]!='\0';i++)
        Lcd_Write_Char(a[i]);
}

void Lcd_Shift_Right(void)
{
    Lcd_Cmd(0x01);
    Lcd_Cmd(0x0C);
}

void Lcd_Shift_Left(void)
{
    Lcd_Cmd(0x01);
    Lcd_Cmd(0x08);
}

void Lcd_Blink(void)
{
    Lcd_Cmd(0x00);
    Lcd_Cmd(0x0F);
}

void Lcd_NoBlink(void)
{
    Lcd_Cmd(0x00);
    Lcd_Cmd(0x0C);
}



void main(void) {
    char dato_rx;
    int estado1,estado2,estado3,estado4,estado5,estado6,estado7,estado8,estado9,estado10,estado11,estado12;
    estado1=0;//1ENTRADA Y 0 SALIDA
    estado2=0;
    estado3=0;
    estado4=0;
    estado5=0;
    estado6=0;
    estado7=0;
    estado8=0;
    estado9=0;
    estado10=0;
    estado11=0;
    estado12=0;
    TRISAbits.TRISA0 =1;//M01
    TRISAbits.TRISA1 =1;//M02
    TRISAbits.TRISA2 = 1;//M03
    TRISAbits.TRISA3 = 1;//M04
    TRISAbits.TRISA4 = 1;//M05
    TRISAbits.TRISA5 = 1;//M06
    TRISBbits.TRISB0 =1;//M07
    TRISBbits.TRISB1 =1;//M08
    TRISBbits.TRISB2 = 1;//M09
    TRISBbits.TRISB3 = 1;//M010
    TRISBbits.TRISB4 = 1;//M011
    TRISBbits.TRISB5 = 1;//M012
    TRISEbits.TRISE0 = 1;//modaut
    TRISCbits.TRISC0 = 1;//modaut2
    TRISCbits.TRISC1 = 1;//modaut3
    
    PORTAbits.RA0=0;
    PORTAbits.RA1=0;
    PORTAbits.RA2=0;
    PORTAbits.RA3=0;
    PORTAbits.RA4=0;
    PORTAbits.RA5=0;
    PORTBbits.RB0=0;
    PORTBbits.RB1=0;
    PORTBbits.RB2=0;
    PORTBbits.RB3=0;
    PORTBbits.RB4=0;
    PORTBbits.RB5=0;
    PORTEbits.RE0=0;
    PORTCbits.RC0=0;
    PORTCbits.RC1=0;
    
    
    TRISEbits.TRISE1 = 0;//SALIDA DEL LED
    PORTEbits.RE1=1;

    ADCON1=0b00000110;
    UART_init();
    Lcd_Init();
    //UART_printf("hola mundo");
    //UART_write('0');
    
        Lcd_Set_Cursor(1,1);
        sprintf(buffer, " BRAZO ROBOTICO 6grados");
        Lcd_Write_String(buffer);
        Lcd_Set_Cursor(2,1);
        sprintf(buffer, "FACULTAD DE INGENIERIA");
        Lcd_Write_String(buffer);
        __delay_ms(2000);
        Lcd_Clear();
    
    
    while(1){
  
        
        if(PORTAbits.RA0 == 1)
            
        {
            __delay_ms(20);
            if(PORTAbits.RA0)
            {
            Lcd_Set_Cursor(1,1);
            sprintf(buffer, " SENTIDO HORARIO");
            Lcd_Write_String(buffer);
            
            UART_write('1');
            PORTEbits.RE1 = 1;
            estado1=1;
            }
        }
        
        else
            
        {
            __delay_ms(20);
           // if(PORTBbits.RB5)
            //{
             
            while(estado1){
            
            UART_write('0');
            PORTEbits.RE1 = 0;
            estado1=0;
            }
            //}
        }
        
         
        /*
        if(PORTAbits.RA2==1);
        {
            __delay_ms(100);
            if(PORTAbits.RA2){
            UART_write('2');
           // UART_printf("mov. a izquierda \n\r");
            }
        }
        if(PORTAbits.RA3==1)
        {
            __delay_ms(100);
            if(PORTAbits.RA3){
            UART_write('3');
           // UART_printf("mov. a DERECHA \n\r");
            }
        }
        
        */   
        // EL ANTERIOR ALGORITMO APAGA Y PRENDE CON DOS BOTONES
        /*
        dato_rx = UART_read();
        if(dato_rx == '1')
        {
            PORTBbits.RB0 = 1;
            PORTBbits.RB1 = 0;
        }
        if(dato_rx == '0')
        {
            PORTBbits.RB0 = 0;
            PORTBbits.RB1 = 1;
        }*///ALGORITMO PARA RECIBIR UN DATO
                if(PORTAbits.RA1 == 1)
            
        {
            __delay_ms(20);
            if(PORTAbits.RA1)
            {
                Lcd_Clear();
                    Lcd_Set_Cursor(1,1);
        sprintf(buffer, "SENTIDO ANTIHORARIO");
        Lcd_Write_String(buffer);

        UART_write('3');
            PORTEbits.RE1 = 1;
            estado2=1;
            }
        }
        
        else
            
        {
            __delay_ms(20);
           // if(PORTBbits.RB5)
            //{
            
            while(estado2){
            UART_write('2');
            PORTEbits.RE1 = 0;
            estado2=0;
            }
            //
        }
        
         
                if(PORTAbits.RA2 == 1)
            
        {
            __delay_ms(20);
            if(PORTAbits.RA2)
            {
                Lcd_Clear();
         Lcd_Set_Cursor(1,1);
        sprintf(buffer, " ESLABON 1 ARRIBA");
        Lcd_Write_String(buffer);
         
        UART_write('5');
            PORTEbits.RE1 = 1;
            estado3=1;
            }
        }
        
        else
            
        {
            __delay_ms(20);
           // if(PORTBbits.RB5)
            //{
 
            while(estado3){
            UART_write('4');
            PORTEbits.RE1 = 0;
            estado3=0;
            }
            //
        }
                if(PORTAbits.RA3 == 1)
            
        {
            __delay_ms(20);
            if(PORTAbits.RA3)
            {
                    Lcd_Clear();
                    Lcd_Set_Cursor(1,1);
        sprintf(buffer, " ESLABON 1 ABAJO");
        Lcd_Write_String(buffer);
         
        UART_write('7');
            PORTEbits.RE1 = 1;
            estado4=1;
            }
        }
        
        else
            
        {
            __delay_ms(20);
           // if(PORTBbits.RB5)
            //{

            while(estado4){
            UART_write('6');
            PORTEbits.RE1 = 0;
            estado4=0;
            }
            //
        }
                if(PORTAbits.RA4 == 1)
            
        {
            __delay_ms(20);
            if(PORTAbits.RA4)
            {
                    Lcd_Clear();
                    Lcd_Set_Cursor(1,1);
        sprintf(buffer, " ESLABON 2 ARRIBA");
        Lcd_Write_String(buffer);
         
        UART_write('9');
            PORTEbits.RE1 = 1;
            estado5=1;
            }
        }
        
        else
            
        {
            __delay_ms(20);
           // if(PORTBbits.RB5)
            //{
  
            while(estado5){
            UART_write('8');
            PORTEbits.RE1 = 0;
            estado5=0;
            }
            //
        }
                if(PORTAbits.RA5 == 1)
            
        {
            __delay_ms(20);
            if(PORTAbits.RA5)
            {
                                Lcd_Clear();
                    Lcd_Set_Cursor(1,1);
        sprintf(buffer, " ESLABON 2 ABAJO");
        Lcd_Write_String(buffer);
         
        UART_write('B');
            PORTEbits.RE1 = 1;
            estado6=1;
            }
        }
        
        else
            
        {

           // if(PORTBbits.RB5)
            //{
   
            while(estado6){
            UART_write('A');
            PORTEbits.RE1 = 0;
            estado6=0;
            }
            //
        }
                if(PORTBbits.RB0 == 1)
            
        {
            __delay_ms(20);
            if(PORTBbits.RB0)
            {
                                Lcd_Clear();
                    Lcd_Set_Cursor(1,1);
        sprintf(buffer, "ESLABON 3 ARRIBA");
        Lcd_Write_String(buffer);
         
        UART_write('D');
            PORTEbits.RE1 = 1;
            estado7=1;
            }
        }
        
        else
            
        {
            __delay_ms(20);
           // if(PORTBbits.RB5)
            //{

            while(estado7){
           UART_write('C');
            PORTEbits.RE1 = 0;
            estado7=0;
            }
            //
        }
                if(PORTBbits.RB1 == 1)
            
        {
            __delay_ms(20);
            if(PORTBbits.RB1)
            {
                                Lcd_Clear();
                    Lcd_Set_Cursor(1,1);
        sprintf(buffer, "ESLABON 3 ABAJO");
        Lcd_Write_String(buffer);
        
        UART_write('F');
            PORTEbits.RE1 = 1;
            estado8=1;
            }
        }
        
        else
            
        {
            __delay_ms(20);
           // if(PORTBbits.RB5)
            //{

            while(estado8){
            UART_write('E');
            PORTEbits.RE1 = 0;
            estado8=0;
            }
            //
        }
                if(PORTBbits.RB2 == 1)
            
        {
            __delay_ms(20);
            if(PORTBbits.RB2)
            {
                     Lcd_Clear();
                    Lcd_Set_Cursor(1,1);
        sprintf(buffer, " PINZA HORARIO");
        Lcd_Write_String(buffer);
        
        UART_write('H');
            PORTEbits.RE1 = 1;
            estado9=1;
            }
        }
        
        else
            
        {
            __delay_ms(20);
           // if(PORTBbits.RB5)
            //{
 
            while(estado9){
            UART_write('G');
            PORTEbits.RE1 = 0;
            estado9=0;
            }
            //
        }
                if(PORTBbits.RB3 == 1)
            
        {
            __delay_ms(20);
            if(PORTBbits.RB3)
            {
                     Lcd_Clear();
                    Lcd_Set_Cursor(1,1);
        sprintf(buffer, "PINZA ANTIHORARIO");
        Lcd_Write_String(buffer);
         
        UART_write('J');
            PORTEbits.RE1 = 1;
            estado10=1;
            }
        }
        
        else
            
        {
            __delay_ms(20);
           // if(PORTBbits.RB5)
            //{

            while(estado10){
            UART_write('I');
            PORTEbits.RE1 = 0;
            estado10=0;
            }
            //
        }
                if(PORTBbits.RB4 == 1)
            
        {
            __delay_ms(20);
            if(PORTBbits.RB4)
            {
                     Lcd_Clear();
                    Lcd_Set_Cursor(1,1);
        sprintf(buffer, " PINZA AGARRE");
        Lcd_Write_String(buffer);
         
        UART_write('L');
            PORTEbits.RE1 = 1;
            estado11=1;
            }
        }
        
        else
            
        {
            __delay_ms(20);
           // if(PORTBbits.RB5)
            //{
   
            while(estado11){
            UART_write('K');
            PORTEbits.RE1 = 0;
            estado11=0;
            }
            //
        }
                if(PORTBbits.RB5 == 1)
            
        {
            __delay_ms(20);
            if(PORTBbits.RB5)
            {
                      Lcd_Clear();
                    Lcd_Set_Cursor(1,1);
        sprintf(buffer, "PINZA RELAJAMIENTO");
        Lcd_Write_String(buffer);
         
        UART_write('N');
            PORTEbits.RE1 = 1;
            estado12=1;
            }
        }
        
        else
            
        {
            __delay_ms(20);
           // if(PORTBbits.RB5)
            //{
   
            while(estado12){
            UART_write('M');
            PORTEbits.RE1 = 0;
            estado12=0;
            }
            //
        }
                if(PORTEbits.RE0 == 1)
            
        {
            __delay_ms(20);
            if(PORTEbits.RE0)
            {
                            Lcd_Clear();
            UART_write('O');
            PORTEbits.RE1 = 1;
            Lcd_Set_Cursor(1,1);
        sprintf(buffer, "MODO AUTOMATICO1");
        Lcd_Write_String(buffer);
         
            }
        }


            //
        
        
        
            //
        
                        if(PORTCbits.RC0 == 1)
            
        {
            __delay_ms(20);
            if(PORTCbits.RC0)
            {
                            
            UART_write('Q');
            PORTEbits.RE1 = 1;
            Lcd_Clear();
            Lcd_Set_Cursor(1,1);
        sprintf(buffer, "MODO AUTOMATICO2");
        Lcd_Write_String(buffer);
        
            }
        }

            //
        
                        if(PORTCbits.RC1 == 1)
            
        {
            __delay_ms(20);
            if(PORTCbits.RC1)
            {
            
            UART_write('R');
            PORTEbits.RE1 = 1;
            Lcd_Clear();
            Lcd_Set_Cursor(1,1);
        sprintf(buffer, "MODO AUTOMATICO3");
        Lcd_Write_String(buffer);
            
            }
        }


            //
    }    
    return;

}