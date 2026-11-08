/*funciones*/
void UART_init(void);
char UART_read(void);
void UART_write(char dato);
void UART_printf(char *cadena);

/*implementacion de funciones*/
void UART_init(void)
{
    TRISGbits.TRISG2 = 1;   //RX input
    TRISGbits.TRISG1 = 0;   //TX output 
    ANSELG=0x00;
    TX2STAbits.SYNC = 0;     //UART
    TX2STAbits.TX9 = 0;      //8 BITS
    TX2STAbits.BRGH = 1;     //ALTA VELOCIDAD
    SP2BRGL = 103;            //9600 a 4MHZ 103 0 25
    //SP2BRGH = 0;
	BAUD2CONbits.BRG16 = 0;
	RC2STAbits.SPEN = 1;     //UART on    
    TX2STAbits.TXEN = 1;     //TX on
    RC2STAbits.CREN = 1;     //RX on
}

char UART_read(void)
{
	if(PIR4bits.RC2IF == 1)
		return RC2REG;
	else
		return 0;
}

void UART_write(char dato)
{
	TX2REG = dato;
	while(TX2STAbits.TRMT == 0);
}

void UART_printf(char *cadena)
{
	while(*cadena !=0x00){
		UART_write(*cadena);
		cadena++;
	}
}
