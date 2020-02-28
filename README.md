# Carbon12
Corso di SWE UniPD 2019-2020.
Repository addestramento progetto C4-Predire in Grafana.

## Contenuto
* Repo *node_modules*: contiene la libreria SVM;
* Repo *public*: contiene lo stile CSS pagine addestramento;
* Repo *view*: contiene le pagine *.ejs* dell'addestramento;
* *app.js*: javascript per avviare l'attività di addestramento;
* *csvread.js*: javascript per la trasformazione del *.csv* in array;
* *r_w_predittore.js*: lettura e scrittura del file *predittore.json*;
* *grafana_data_export.csv*: esempio di *.csv*;
* *package-lock.json*: contiene la descrizione del progetto e delle dipendenze, si genera in automatico.

## Come opera
All'interno della Repository Addestramento troviamo il codice necessario per addestrare la macchina (**SVM** o **RL**).
Più precisamente *app.js* permette la creazione del server nel quale verranno inseriti il file CSV (*.csv*) contenente 
i dati di addestramento, e, qualora si sia già fatto l'addestramento almeno una volta, ma lo si voglia riaddestrare 
tramite nuovi dati, si potrà inserire anche il file *predittore.json* contenente il vecchio Predittore.
Tramite l'apposito pulsante per l'avvio dell'operazione, il processo di addestramento procederà nel seguente modo:
1. Trasformazione dell'contenuto del *file.csv* in 3 array:
	- **Array Sorgenti**: contenente i nomi delle sorgenti da analizzare
	- **Array data**: contenente i dati per l'addestramento
	- **Array labels**: contenente le etichette di classificazione
2. Attività di addestramento dell'apposita libreria (**SVM** o **RL**)
	- Attualmente sviluppata solo per **SVM** in un prossimo aggiornamento sarà disponibile anche l'altra libreria.
3. Scrittura del *predittore.json*
	- Nel caso in cui tale file sia già stato generato ed è stato inserito nella pase di input, i dati che lo contengono 
	  verranno aggiornati opportunamente.
	- Altrimenti ne verrà generato uno nuovo.
	
## Regole per la struttura del file.csv
1.  Per ottenere il *file.csv* che si vuole addestrare, estrapolare i dati monitorati da Grafana.
	Il file così ottenuto si presenterà nel seguente modo:
![Esempio del file.csv estratto da Grafana](https://github.com/alek4k/Carbon12/img_README/CatturaExportGrafana.png)
2.  Bisognerà che l'Utente-Amministratore modifichi necessariamente tale file in modo tale che sia possibile la lettura 
	del *file.csv*.
	La struttura da rispettare è la seguente:
	- Nella prima riga devono essere presenti le seguenti voci: Times, Series1, Series2, Series3, ..., Labels;
		- **Series1, Series2, Series3, ...**: sono le voci che nel *file.csv* estratto da Grafana presenti nella prima 
		  colonna;
		- **Labels**: sono le etichette che definirà l'Utente Amministratore per indicare la classificazione dei dati.
	- Nella prima colonna (dalla seconda riga in giu) saranno contenuti tutti i tempi registrati, presenti nella seconda
	  colonna del *file.csv*;
	- Dalla seconda colonna alla penultima (dalla seconda riga in giu) saranno presenti tutti i **Values** ricavanti dalla
	  terza colonna del *file.csv*;
	- Nell'ultima colonna saranno presenti i **Labels** o meglio le etichette di classificazione stabilite
	  dall'Utente-Amministratore.
![Esempio del file.csv estratto da Grafana](https://github.com/alek4k/Carbon12/img_README/CatturaFileCSVModificato.png)

## Struttura del predittore.json
Il file predittore.json avrà una struttura predefinita, tramite la quale sarà possibile la lettura dei risultati nel
plug-in di Grafana da noi creato.

La sua struttura è la seguente:
* **header**: contiene le informazioni generali del progetto;
* **data-entry**: contiene i nomi delle sorgenti estratte dal CSV;
* **model**: specifica il modello di machine learning addestrato;
* **file-version**: specifica quante volte è stato addestrato il file predittore.json con quelle data-entry;
* **configuration**: contiene i risultati dell'addestramento.

## Uso dell'codice passo per passo
Per l'utilizzo bisogna avere una cartella in locale contenente la repository *addestramento*.
Procedimento ora per avviare il programma di adestramento:
1. Accedere alla cartella in locale addestramento e tramite terminale avviare *app*;
	```
	node app
	```
2. Accedere al localhost *http://localhost:8080/*;
3. Inserire il file *.csv*;
4. Se si desidera riaddestrare, inserire il vecchio *predittore.json*;
5. Attivare pulsante *Avvio Addestramento*;
6. Scaricare il nuovo *predittore.json* tramite il pulsante *Download predittore*;
7. Se si vuole addestrare altro premere *Ritorna Home*.
