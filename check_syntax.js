try {
    require('./Backend/controllers/librarianController.js');
    console.log('librarianController.js syntax is OK.');
} catch (e) {
    console.error('Error in librarianController.js:', e);
}
try {
    require('./Backend/routes/librarianRoutes.js');
    console.log('librarianRoutes.js syntax is OK.');
} catch (e) {
    console.error('Error in librarianRoutes.js:', e);
}
try {
    require('./Backend/routes/index.js');
    console.log('index.js syntax is OK.');
} catch (e) {
    console.error('Error in index.js:', e);
}
