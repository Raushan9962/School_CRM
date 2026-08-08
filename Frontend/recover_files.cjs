const fs = require('fs');
const path = require('path');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\Abcom\\.gemini\\antigravity-ide\\brain\\34b559fe-fa22-4998-a719-c0b2fb29a7e9\\.system_generated\\logs\\transcript_full.jsonl';
const targetDir = 'd:\\Demo Office\\MyDemo\\School_CRM\\Frontend\\src\\pages\\Teacher\\components';

// We want to find the latest valid content for each file before 2026-08-07T10:34:00Z (when I ran the bad script).
// Actually, it's easier to just find the latest `view_file` output or `CodeContent` in `write_to_file`.
// Wait, I used a lot of `replace` scripts. The `replace` scripts read the file from disk, but they didn't output the full content to the transcript.
// If the file was not viewed or written fully in the transcript, it might be hard to recover.
// Let's first search the transcript for any full content of DashboardOverview.jsx.

async function search() {
    const fileStream = fs.createReadStream(transcriptPath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let latestContent = {};

    for await (const line of rl) {
        try {
            const entry = JSON.parse(line);
            // Search in tool calls (write_to_file)
            if (entry.tool_calls) {
                for (const call of entry.tool_calls) {
                    if (call.name === 'write_to_file' && call.args && call.args.TargetFile && call.args.TargetFile.includes('Teacher\\\\components\\\\DashboardOverview.jsx')) {
                        latestContent['DashboardOverview.jsx'] = call.args.CodeContent;
                    }
                }
            }
            // Search in tool responses (view_file)
            if (entry.type === 'PLANNER_RESPONSE' && entry.content) {
                 // view_file output is in the transcript? Actually, view_file responses come from SYSTEM or tool response.
            }
            if (entry.source === 'SYSTEM' || entry.type === 'TOOL_RESPONSE') {
                if (line.includes('DashboardOverview.jsx') && line.includes('Total Lines')) {
                     // Extract code from view_file output
                     const match = line.match(/The following code has been modified.*?<original_line>\.(.*?)$/s);
                     if (match) {
                         let code = match[1];
                         // strip line numbers
                         code = code.replace(/^\d+:\s/gm, '');
                         latestContent['DashboardOverview.jsx_view'] = code;
                     }
                }
            }
        } catch (e) {}
    }
    console.log(Object.keys(latestContent));
    fs.writeFileSync('d:\\Demo Office\\MyDemo\\School_CRM\\Frontend\\recovery_log.txt', JSON.stringify(Object.keys(latestContent), null, 2));
}
search();
