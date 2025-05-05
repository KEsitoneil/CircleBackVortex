export function parseCSV(csvText: string) {
  // Split the CSV text into lines
  const lines = csvText.split("\n")

  // Extract the header row and split it into column names
  const headers = lines[0].split(",").map((header) => header.trim())

  // Process each data row
  const data = []
  for (let i = 1; i < lines.length; i++) {
    // Skip empty lines
    if (!lines[i].trim()) continue

    const values = lines[i].split(",").map((value) => value.trim())

    // Create an object for this row
    const row: Record<string, any> = {}
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j]
    }

    data.push(row)
  }

  return data
}
