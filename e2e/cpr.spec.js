import { test, expect } from '@playwright/test';

test('test CPR btn', async ({ page }) => {
    await page.goto('http://localhost:8080/');

    // reference to the html element
    const output = page.getByTestId('output');

    await page.getByTestId('btn-cpr').click();

    // wait for the output to change
    await expect(output).not.toHaveText("Click a button to call the API…");

    const data = JSON.parse(await output.textContent());

    // check if 10 long
    expect(data.CPR).toHaveLength(10);
    // check if only numbers
    expect(/^\d+$/.test(data.CPR)).toBeTruthy();
});