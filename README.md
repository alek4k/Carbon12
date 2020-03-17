[![Build Status](https://travis-ci.com/alek4k/Carbon12.svg?token=aGyxqazAisPLCopSpzkZ&branch=master)](https://travis-ci.com/alek4k/Carbon12)

# Carbon 12
Repository del Proof of Concept realizzato per il progetto **Predire in Grafana - Monitoraggio predittivo per DevOps -** dell'insegnamento Ingegneria del Software dell'Università degli studi di Padova A.A. 2019/2020.

## Scopo 
Il progetto Predire in Grafana ha l'obiettivo di creare un plug-in per il software di monitoraggio Grafana che applichi i modelli SVM e RL per l'analisi predittiva di un flusso di dati e l'individuazione di eventuali criticità. Il plug-in viene accompagnato da un programma per l'addestramento dei modelli di machine learning a partire da alcuni dati noti. 

---

## Prerequisiti 
**Grafana 6.5.x**
disponibile all'indirizzo [Grafana: The open observability platform \| Grafana Labs](https://grafana.com)

**node.js**
disponibile all'indirizzo [Node.js](https://nodejs.org/it/)

---

## Installazione plug-in

Spostare la cartella `predire-in-grafana-app` nella cartella `grafana/data/plugins`, successivamente installare le dipendenze e creare la build utilizzando i comandi seguenti:

```
yarn install
yarn build
```
oppure:
```
npm install
npm build
```

--- 

## Installazione programma di addestramento
Spostare la cartella `addestramento` nella posizione desiderata, in modo che sia disponibile agli utenti che dovranno gestire l'addestramento. 

--- 

#### Componenti 
| Nome                 | Matricola |
| :--------------------|:---------:| 
| Giacomo Callegari    | 1122658   | 
| Manuel De Franceschi | 1162299   |
| Nicolò Fassina       | 1166190   |
| Francesco Gobbo      | 1120713   | 
| Andrea Longo         | 1174957   |
| Alessandro Lovo      | 1142682   |
| Veronica Pederiva    | 1161493   |
