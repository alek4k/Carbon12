# Predire in Grafana

Predire in Grafana è un plug-in realizzato dal gruppo Carbon12 per l'insegnamento di Ingegneria del Software a.a.2019/2020.

## Scopo

Predire in Grafana è un plug-in sviluppato per Grafana v6.5.0, la cui utilità è quella di fornire all'utente un servizio di previsione dei valori di determinati nodi monitorati dal sistema.  
Lo scopo del plug-in è quello di analizzare il flusso di dati proveniente da Grafana per fornire delle previsioni riguardo i punti critici di utilizzo della linea di produzione del software.   
L’analisi dei dati e le previsionisaranno effettuate utilizzando modelli di machine learning quali Support Vector Machine e Regressione Lineare.  
I risultati delle previsioni verranno forniti in modo grafico agli utenti che monitorano il sistema.  
Per il corretto utilizzo del plug-in è necessario essere in possesso del programma di addestramento, il quale una volta forniti dei dati di monitoraggio validi sarà in grado di addestrare il modello desiderato e produrre un file JSON che verrà richiesto dal plug-in in fase di configurazione.

## Componenti
I componenti del gruppo Carbon12:

- Giacomo Callegari 1122658
- Manuel De Franceschi 1162299
- Nicolò Fassina 1166190
- Francesco Gobbo 1120713
- Andrea Longo 1174957
- Alessandro Lovo 1142682
- Veronica Pederiva 1161493