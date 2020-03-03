# Carbon12

Repository del plug-in `predire-in-grafana-app` incluso nel Proof of Concept realizzato per il progetto **Predire in Grafana - Monitoraggio predittivo per DevOps -** dell'insegnamento Ingegneria del Software dell'Università degli studi di Padova A.A. 2019/2020.

## Scopo
Predire in Grafana è un plug-in sviluppato per Grafana v6.5.x, la cui utilità è quella di fornire all'utente un servizio di previsione dei valori di determinati nodi monitorati dal sistema.  
Lo scopo del plug-in è quello di analizzare il flusso di dati proveniente da Grafana per fornire delle previsioni riguardo i punti critici di utilizzo della linea di produzione del software.   
L’analisi dei dati e le previsioni saranno effettuate utilizzando modelli di machine learning quali Support Vector Machine e Regressione Lineare.  
I risultati delle previsioni verranno poi forniti in forma grafica agli utenti che monitorano il sistema.  
Per il corretto utilizzo del plug-in è necessario essere in possesso del programma di addestramento, il quale una volta forniti dei dati di monitoraggio validi sarà in grado di addestrare il modello desiderato e produrre un file contenente tutte le informazioni utili alla configurazione del plug-in.

---

## Utilizzo

***Prerequisiti***  
Per garantire un corretto funzionamento del plug-in è necessario:

- essere in possesso del file JSON contenente il modello allenato e le informazioni utili per una corretta configurazione.
- aver installato il runtime environment di JavaScript [Node.JS](https://nodejs.org/en/).
- aver installato un Node Package Manager come [npm](https://nodejs.org/en/), o alternativamente [yarn](https://yarnpkg.com/).

***Build***  
Per l'installazione del plug-in è necessario spostare la cartella `predire-in-grafana-app` all'interno della cartella di Grafana dedicata ai plug-ins, `grafana/data/plugins`.

Successivamete è necessario scaricare le dipendeze e creare la build, tramite i comandi:
```
npm install
npm build

// alternativamente si può utilizzare yarn

yarn install
yarn build

```

***Avvio***  
Dopo aver avviato Grafana, è sufficiente accedere alla scheda dedicata ai plug-in ed attivare `Predire in Grafana`.

Accedendo alla pagina di configurazione del plug-in verrà richiesto di inserire il file JSON contenente il modello addestrato, e successivamente sarà possibile selezionare le sorgenti desiderate tra quelle disponibili.

Una volta cliccato su `Crea pannello` verrà generata automaticamente una dashboard contenente il pannello configurato.

---

## Componenti
| Nome                 | Matricola |
| :--------------------|:---------:| 
| Giacomo Callegari    | 1122658   | 
| Manuel De Franceschi | 1162299   |
| Nicolò Fassina       | 1166190   |
| Francesco Gobbo      | 1120713   | 
| Andrea Longo         | 1174957   |
| Alessandro Lovo      | 1142682   |
| Veronica Pederiva    | 1161493   |




