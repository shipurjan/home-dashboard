// Command text is a chromedp example demonstrating how to extract text from a
// specific element.
package main

import (
	"context"
	"database/sql"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/chromedp"
	_ "github.com/go-sql-driver/mysql"
)

type TimetableEntry struct {
	lineNumber string
	departsIn  string
}

func connectToMariaDB() (*sql.DB, error) {
	db, err := sql.Open("mysql", "username:password@tcp(localhost:3306)/mydb")
	if err != nil {
		return nil, err
	}

	// Ping the MariaDB server to ensure connectivity
	err = db.Ping()
	if err != nil {
		return nil, err
	}

	log.Println("Connected to MariaDB!")
	return db, nil
}

func createEntry(db *sql.DB, line_number int, departs_in string) error {
	_, err := db.Exec("INSERT INTO nearest_bus_departures (line_number, departs_in) VALUES (?, ?)", line_number, departs_in)
	return err
}

func main() {

	headlessShellURL := "wss://localhost:9222"
	// create remote allocator
	allocatorCtx, cancel := chromedp.NewRemoteAllocator(context.Background(), headlessShellURL)
	defer cancel()

	// create context
	ctx, cancel := chromedp.NewContext(allocatorCtx)
	defer cancel()

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-c
		log.Println("Gracefully shutting down...")
		cancel()
		os.Exit(1)
	}()

	for {
		var timeTables []*cdp.Node
		err := chromedp.Run(ctx,
			chromedp.Navigate(`https://rozklady.bielsko.pl/#stop/2365/50/NO/`),
			chromedp.Nodes(`div#stoppoint-realtime-entries-box`, &timeTables, chromedp.ByQuery),
		)
		if err != nil {
			log.Fatal("Error:", err)
		}

		for _, node := range timeTables {
			log.Println(node.NodeValue)

		}

		if len(timeTables) != 1 {
			log.Fatal("Error:", "Expected 1 timetable entry")
		}

		var timeTable = timeTables[0]

		var timetableEntries []*cdp.Node
		// run task list
		err = chromedp.Run(ctx,
			chromedp.Nodes(`span.stoppoint-ascending--entry`, &timetableEntries, chromedp.ByQueryAll, chromedp.FromNode(timeTable)),
		)
		if err != nil {
			log.Fatal("Error:", err)
		}

		log.Println("Found", len(timetableEntries), "timetable entries")

		var timetable []TimetableEntry
		for _, node := range timetableEntries {
			var (
				departsIn  string
				lineNumber string
			)
			err = chromedp.Run(ctx,
				chromedp.TextContent("span.stoppoint-ascending--entry_time", &departsIn, chromedp.ByQuery, chromedp.FromNode(node)),
				chromedp.Text("span.stoppoint-ascending--entry_line", &lineNumber, chromedp.ByQuery, chromedp.FromNode(node)),
			)

			if err != nil {
				log.Fatal("Error:", err)
			}

			timetableEntry := TimetableEntry{}
			timetableEntry.departsIn = departsIn
			timetableEntry.lineNumber = lineNumber

			timetable = append(timetable, timetableEntry)
		}

		log.Println(timetable)
		time.Sleep(1 * time.Second) // wait 15 sec
	}
}
