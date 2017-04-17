(function () {
    'use strict';

    var INVOICE_CONSTANTS = {
        currentMessage: [
            'Hi {receiverName},',
            'The following invoice has been created on your account:',
            'Invoice Number: {number}',
            'From: {senderName}',
            'Balance Due: {balanceDue}',
            'Total: {total}',
            'Amount Paid: {amountPaid}',
            'Notes: {notes}',
            'Terms: {terms}',
        ].join('\n'),

        messageTags: [
            { tag: '{number}', replaceWith: 'number' },
            { tag: '{senderName}', replaceWith: 'senderName' },
            { tag: '{receiverName}', replaceWith: 'receiverName' },
            { tag: '{balanceDue}', replaceWith: 'balanceDue' },
            { tag: '{total}', replaceWith: 'total' },
            { tag: '{amountPaid}', replaceWith: 'amountPaid' },
            { tag: '{notes}', replaceWith: 'notes' },
            { tag: '{terms}', replaceWith: 'terms' }
        ]
    };

    angular
        .module('invoices')
        .constant('INVOICE_CONSTANTS', INVOICE_CONSTANTS);

})();