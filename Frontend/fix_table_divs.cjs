const fs = require('fs');
const path = require('path');

const basePath = 'd:\\Demo Office\\MyDemo\\School_CRM\\Frontend\\src\\pages\\Teacher\\components';
const files = fs.readdirSync(basePath).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    let filePath = path.join(basePath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Check if it has the exact opening tag we tried to inject
    const hasOpening = content.includes('<div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm"><table');
    
    // If it DOES NOT have the opening tag, but HAS </table></div>, it's a mismatch!
    if (!hasOpening && content.includes('</table></div>')) {
        content = content.replace(/<\/table><\/div>/g, '</table>');
    }

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed mismatched table div in: ${file}`);
    }
});
