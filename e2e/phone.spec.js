import { test, expect } from '@playwright/test';

test('test phone btn', async ({ page }) => {
    await page.goto('http://localhost:8080/');

    // reference to the html element
    const output = page.getByTestId('output');

    await page.getByTestId('btn-phone').click();

    await expect(output).toBeVisible();

    // wait for the output to change
    await expect(output).not.toHaveText("Click a button to call the API…");

    // Get the output text
    const outputText = await output.textContent();

    const data = JSON.parse(outputText);

    // check if 8 long
    expect(data.phoneNumber).toHaveLength(8);

    // check if only numbers
    expect(/^\d+$/.test(data.phoneNumber)).toBeTruthy();

});