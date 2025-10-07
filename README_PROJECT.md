# Personal Test Data Generator

This is the Python implementation of the fake Danish personal data generator.

## Setup

1. Make a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Testing

- Unit tests: `pytest tests/unit/`
- Integration tests: `pytest tests/integration/`
- API tests: `pytest tests/api/`
- E2E tests: `pytest tests/e2e/`
