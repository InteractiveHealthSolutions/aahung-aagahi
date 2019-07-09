package com.ihsinformatics.aahung.common;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.RecyclerView;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.model.FormDetails;

import java.util.List;

public class FormsAdaper extends RecyclerView.Adapter<FormsAdaper.FormViewHolder> {

    private List<FormDetails> formDetailsList;
    private FormAdapterListener formListener;

    public FormsAdaper(List<FormDetails> formDetailsList, FormAdapterListener formListener) {
        this.formDetailsList = formDetailsList;
        this.formListener = formListener;
    }

    @NonNull
    @Override
    public FormViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_form, parent, false);
        return new FormViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull FormViewHolder holder, int position) {
        holder.title.setText(formDetailsList.get(position).getName());
        holder.desc.setText(formDetailsList.get(position).getDesc());
        holder.card.setOnClickListener(Navigation.createNavigateOnClickListener(R.id.actionform));
    }

    @Override
    public int getItemCount() {
        return formDetailsList.size();
    }

    static class FormViewHolder extends RecyclerView.ViewHolder {

        CardView card;
        TextView title;
        TextView desc;


        FormViewHolder(@NonNull View itemView) {
            super(itemView);
            title = itemView.findViewById(R.id.form_title);
            desc = itemView.findViewById(R.id.form_desc);
            card = itemView.findViewById(R.id.root);
        }
    }
}
