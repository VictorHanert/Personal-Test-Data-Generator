import { test, expect } from '@playwright/test';

test('test cpr-name-gender btn', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    // reference to the html element
    const output = page.getByTestId('output');

    await expect(output).toBeVisible();

    await page.getByTestId('btn-cpr-name-gender').click();

    // wait for the output to change
    await expect(output).not.toHaveText("Click a button to call the API…");

    // Get the output text
    const outputText = await output.textContent();

    const data = JSON.parse(outputText);

    // check if 10 long
    expect(data.CPR).toHaveLength(10);
    // check if only numbers
    expect(/^\d+$/.test(data.CPR)).toBeTruthy();

    // Check that firstName and lastName start with an uppercase letter
    expect(data.firstName).toMatch(/^[A-Z]/);
    expect(data.lastName).toMatch(/^[A-Z]/);
});