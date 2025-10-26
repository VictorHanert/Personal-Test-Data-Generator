import { test, expect } from '@playwright/test';

// List of test cases
const testCases = [
    { inputValue: '1106010260', gender: "female", expectedStatus: '200 OK' },
    { inputValue: '0901524346', gender: "female", expectedStatus: '200 OK' },
    { inputValue: '1301505621', gender: "male", expectedStatus: '200 OK' },
    { inputValue: '1301505621', gender: "female", expectedStatus: '400 Bad Request' },
    { inputValue: '0901524346', gender: "male", expectedStatus: '400 Bad Request' },
];

test('test cpr input field, with multiple values', async ({ page }) => {
    for (const testCase of testCases) {
        // Go to page (optional if same page can be reused)
        await page.goto('http://localhost:8080/');


        const output = page.getByTestId('output');
        const status = page.getByTestId('status');


        // Fill the input field
        await page.getByTestId('input-cpr').fill(testCase.inputValue);

        // set to female, if female
        if (testCase.gender == 'female') {
            await page.getByTestId('select-gender').selectOption('female');
        }
        else // else set to male
        {
            await page.getByTestId('select-gender').selectOption('male');
        }

        // click validataion btn
        await page.getByTestId('btn-validate-cpr').click();

        // wait for response
        await expect(output).not.toHaveText('Click a button to call the API…');


        // Parse JSON
        //const data = JSON.parse(await output.textContent());

        await expect(status).toContainText(testCase.expectedStatus);

        
    }
});