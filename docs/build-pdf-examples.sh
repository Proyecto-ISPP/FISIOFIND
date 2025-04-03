
# Important! Command ejecuted from the /docs folder
pandoc "doc.md" -o "doc.pdf" --from markdown+emoji --template "eisvogel.latex" --listings --pdf-engine=xelatex


# Take a look an the difference between the two commands,
#  now ejecuted from a folder inside /docs folder
pandoc "doc.md" -o "doc.pdf" --from markdown+emoji --template "../eisvogel.latex" --listings --pdf-engine=xelatex


# If we want to generate an horizontal doc...
pandoc -V geometry:landscape "doc.md" -o "doc.pdf" --from markdown+emoji --template "eisvogel.latex" --listings --pdf-engine=xelatex


# ---------------- -------------- --------------


# GENERATE README.md

## 1. Install the package (google alternative recommended) outside the venv
pip3 install tiktoken  # if error (and restart the terminal)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh  # if error (and restart the terminal)
pip3 install "readmeai[google-generativeai]" --break-system-packages

## 2. Get API key. Log in with your Google account and get the API key from here:
https://aistudio.google.com/app/apikey

## 3. Generate the README.md
readmeai \
    --api gemini \
    --model gemini-1.5-flash \
    --output readmeai-gemini.md \
    --repository https://github.com/Proyecto-ISPP/FISIOFIND

### if the repository is private
readmeai \
    --api gemini \
    --model gemini-1.5-flash \
    --output readmeai-gemini.md \
    --repository ~Developer/FISIOFIND