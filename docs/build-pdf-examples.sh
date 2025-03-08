
# Important! Command ejecuted from the /docs folder
pandoc "doc.md" -o "doc.pdf" --from markdown+emoji --template "eisvogel.latex" --listings --pdf-engine=xelatex


# Take a look an the difference between the two commands,
#  now ejecuted from a folder inside /docs folder
pandoc "doc.md" -o "doc.pdf" --from markdown+emoji --template "../eisvogel.latex" --listings --pdf-engine=xelatex


# If we want to generate an horizontal doc...
pandoc -V geometry:landscape "doc.md" -o "doc.pdf" --from markdown+emoji --template "eisvogel.latex" --listings --pdf-engine=xelatex
